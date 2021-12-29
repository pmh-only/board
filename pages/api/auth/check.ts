import { tokenVerify } from '../../../utils/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  res.send({ success: tokenVerify(req.cookies.token) })
}
