import shajs from 'sha.js'
import { getClientIp } from 'request-ip'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createDBConnection } from '../../../../utils/db'

const commentCooldown: string[] = []

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const db = createDBConnection()

  if (req.method === 'GET') {
    const comments =
      await db
        .select('*')
        .from('comments')
        .orderBy('id', 'desc')
        .where('board_id', req.query.id)

    return res.send({ comments })
  }

  if (req.method === 'POST') {
    const { type, content } = req.body

    if (!type) return res.send({ success: false, message: 'invalid comment type' })
    if (type === 'IP') {
      const ip = getClientIp(req)!

      if (commentCooldown.includes(ip)) {
        return res.send({ success: false, message: 'uhhuh.. you are writting to fast!' })
      }

      commentCooldown.push(ip)
      setTimeout(() => {
        commentCooldown.splice(commentCooldown.indexOf(ip), 1)
      }, 60 * 1000)

      await db.insert({ board_id: req.query.id, content, author: `익명 (${shajs('sha256').update(ip).digest('hex').substring(0, 5)})` }).into('comments')

      return res.send({ success: true })
    }
  }
}
