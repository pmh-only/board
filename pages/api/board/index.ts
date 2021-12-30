import type { NextApiRequest, NextApiResponse } from 'next'
import { createDBConnection } from '../../../utils/db'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const db = createDBConnection()
  const boards =
    await db.select('*', 'content AS raw_content', db.raw('SUBSTRING(content,1,50) AS content')).from('board')

  return res.send({
    boards: boards.map((row) => ({
      ...row,
      raw_content: undefined,
      image: /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g.exec(row.raw_content)?.[1]
    }))
  })
}
