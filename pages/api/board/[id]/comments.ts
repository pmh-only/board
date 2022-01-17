import type { NextApiRequest, NextApiResponse } from 'next'
import { createDBConnection } from '../../../../utils/db'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const db = createDBConnection()
  const comments =
    await db
      .select('*')
      .from('comments')
      .orderBy('id', 'desc')
      .where('board_id', req.query.id)

  return res.send({ comments })
}
