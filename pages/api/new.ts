import { tokenVerify } from '../../utils/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createDBConnection } from '../../utils/db'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.send({ success: false })

  const { token } = req.cookies
  const { title, content, tags } = req.body

  if (!token || !title || !content) {
    return res.send({ success: false })
  }

  if (!tokenVerify(token)) {
    return res.send({ success: false })
  }

  const db = createDBConnection()
  await db.insert({ title, content, tags }).into('board')

  const id = await db.select('id').from('board').orderBy('id', 'desc').first()
  res.send({ success: true, id: id?.id })
}
