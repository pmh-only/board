import type { NextApiRequest, NextApiResponse } from 'next'
import { createDBConnection } from '../../../utils/db'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const db = createDBConnection()
  const boards =
    await db.select('*', 'content AS raw_content', db.raw('SUBSTRING(content,1,50) AS content')).from('board').orderBy('id', 'desc')

  return res.send({
    boards: boards

      .filter((row) =>
        req.query.has
          ? row.tags.split(',').includes(req.query.has.toString().trim())
          : true)

      .map((row) => ({
        ...row,
        raw_content: undefined,
        image: /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g.exec(row.raw_content)?.[1]
      }))
  })
}
