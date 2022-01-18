import shajs from 'sha.js'
import { getClientIp } from 'request-ip'
import type { NextApiHandler } from 'next'
import { createDBConnection } from '../../../../utils/db'
import { tokenVerify, tokenVerifyAndGetSubject } from '../../../../utils/jwt'

const commentCooldown: string[] = []

/** 댓글 목록 불러오기 API */
const GET: NextApiHandler = async (req, res) => {
  const db = createDBConnection()
  const comments =
    await db
      .select('*')
      .from('comments')
      .orderBy('id', 'desc')
      .where('board_id', req.query.id)

  return res.send({ comments })
}

/** 댓글 작성 API */
const POST: NextApiHandler = async (req, res) => {
  const { token } = req.cookies
  const { type, content } = req.body

  const db = createDBConnection()
  const author =
    type === 'Github'
      ? tokenVerifyAndGetSubject(token)
      : getClientIp(req)

  if (!author) {
    return res.send({ success: false, message: 'GITHUB_TOKEN_ERROR' })
  }

  if (commentCooldown.includes(author)) {
    return res.send({ success: false })
  }

  commentCooldown.push(author)
  setTimeout(() =>
    commentCooldown.splice(commentCooldown.indexOf(author), 1)
  , 60 * 1000)

  const authorHashed =
    shajs('sha256')
      .update(author)
      .digest('hex')
      .substring(0, 5)

  const authorCalc =
    type === 'Github'
      ? `@${author}`
      : `익명 (${authorHashed})`

  await db.insert({
    board_id: req.query.id,
    content,
    author: authorCalc
  }).into('comments')

  return res.send({ success: true })
}

/** 댓글 관리/삭제 API */
const DELETE: NextApiHandler = async (req, res) => {
  const db = createDBConnection()

  const { token } = req.cookies
  const { id } = req.body

  if (!token || !id) return res.send({ success: false })

  if (!tokenVerify(token)) {
    return res.send({ success: false, message: 'invalid token' })
  }

  await db
    .delete()
    .from('comments')
    .where({ id })

  res.send({ success: true })
}

const API: NextApiHandler = (req, res) => {
  if (req.method === 'GET') GET(req, res)
  if (req.method === 'POST') POST(req, res)
  if (req.method === 'DELETE') DELETE(req, res)
}

export default API
