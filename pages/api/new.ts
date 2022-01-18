import { tokenVerify } from '../../utils/jwt'
import type { NextApiHandler } from 'next'
import { createDBConnection } from '../../utils/db'

/** 게시글 등록 API */
const API: NextApiHandler = async (req, res) => {
  const { token } = req.cookies
  const { title, content, tags } = req.body

  if (!token || !title || !content) {
    return res.send({ success: false })
  }

  if (!tokenVerify(token)) {
    return res.send({ success: false })
  }

  const db = createDBConnection()
  await db
    .insert({ title, content, tags })
    .into('board')

  const id = await db
    .select('id')
    .from('board')
    .orderBy('id', 'desc')
    .first()

  res.send({ success: true, id: id?.id })
}

export default API
