import type { NextApiRequest, NextApiResponse } from 'next'
import { createDBConnection } from '../../../utils/db'
import { tokenVerify } from '../../../utils/jwt'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const id = req.query.id as string
    const db = createDBConnection()

    await db.increment('views').from('board').where('id', id)
    const [board] = await db.select('*').from('board').where('id', id)

    return res.send({ success: !!board, board })
  }

  if (req.method === 'POST') {
    const { token } = req.cookies
    const { title, content, tags } = req.body

    if (!token || !title || !content) {
      return res.send({ success: false })
    }

    if (!tokenVerify(token)) {
      return res.send({ success: false })
    }

    const id = req.query.id as string
    const db = createDBConnection()

    const [board] = await db.select('*').from('board').where('id', id)
    if (!board) {
      return res.status(404).send({ success: false, message: 'Board not found' })
    }

    await db('board').where('id', id).update({ title, content, tags })

    return res.send({ success: true, id })
  }
}
