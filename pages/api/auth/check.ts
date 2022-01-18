import type { NextApiHandler } from 'next'
import { tokenVerify } from '../../../utils/jwt'

/** 관리자인지 아닌지 확인하기 위한 API입니다 */
const API: NextApiHandler = (req, res) =>
  res.send({ success: tokenVerify(req.cookies.token) })

export default API
