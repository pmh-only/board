import type { NextApiHandler } from 'next'
import { createDBConnection } from '../../../../utils/db'
import { tokenVerify } from '../../../../utils/jwt'

/** 게시글 불러오기 API */
const GET: NextApiHandler = async (req, res) => {
  const id = req.query.id as string
  const db = createDBConnection()

  const [board] =
    await db
      .select('*')
      .from('board')
      .where('id', id)

  return res.send({ success: !!board, board })
}

/** 게시글 편집 API */
const POST: NextApiHandler = async (req, res) => {
  const { token } = req.cookies
  const id = req.query.id as string
  const { title, content, tags } = req.body

  if (!token || !title || !content) {
    return res.send({ success: false })
  }

  if (!tokenVerify(token)) {
    return res.send({ success: false })
  }

  const db = createDBConnection()

  const [board] =
    await db
      .select('*')
      .from('board')
      .where('id', id)

  if (!board) {
    return res.status(404).send({
      success: false,
      message: 'Board not found'
    })
  }

  await db
    .update({ title, content, tags })
    .where('id', id)
    .from('board')

  return res.send({ success: true, id })
}

/** 게시글 삭제 API */
const DELETE: NextApiHandler = async (req, res) => {
  const { token } = req.cookies
  const id = req.query.id as string

  if (!token || !id) {
    return res.send({ success: false })
  }

  if (!tokenVerify(token)) {
    return res.send({ success: false })
  }

  const db = createDBConnection()
  await db
    .delete()
    .from('board')
    .where('id', id)

  return res.send({ success: true })
}

const API: NextApiHandler = (req, res) => {
  if (req.method === 'GET') GET(req, res)
  if (req.method === 'POST') POST(req, res)
  if (req.method === 'DELETE') DELETE(req, res)
}

export default API
