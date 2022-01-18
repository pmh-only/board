import type { NextApiHandler } from 'next'
import { createDBConnection } from '../../../utils/db'
import { getFirstImageFromMarkdown } from '../../../utils/regexp'

/** 게시글 목록 API */
const API: NextApiHandler = async (req, res) => {
  const db = createDBConnection()

  const boards =
    await db
      .select(
        '*', 'content AS raw_content',
        db.raw('SUBSTRING(content,1,50) AS content'))
      .from('board')
      .orderBy('id', 'desc')

  const filteredBoards =
    boards.filter((row) =>
      req.query.has
        ? row.tags.split(',').includes(req.query.has.toString().trim())
        : true)

  const parsedBoards =
    filteredBoards.map((row) => ({
      ...row,
      raw_content: undefined,
      image: getFirstImageFromMarkdown(row.raw_content)
    }))

  return res.send({ boards: parsedBoards })
}

export default API
