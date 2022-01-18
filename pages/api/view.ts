import type { NextApiHandler } from 'next'
import { createDBConnection } from '../../utils/db'

/** 게시글 조회수 카운트 API */
const API: NextApiHandler = async (req, res) => {
  const id = req.query.id as string
  const db = createDBConnection()

  await db
    .increment('views')
    .from('board')
    .where('id', id)

  return res.send('ok')
}

export default API
