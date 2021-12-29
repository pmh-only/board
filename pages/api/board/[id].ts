import type { NextApiRequest, NextApiResponse } from 'next'
import { createDBConnection } from '../../../utils/db'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string
  const db = createDBConnection()

  await db.increment('views').from('board').where('id', id)
  const [board] = await db.select('*').from('board').where('id', id)

  return res.send({ success: !!board, board })
}
