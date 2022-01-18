import shajs from 'sha.js'
import { tokenSign } from '../../../utils/jwt'
import type { NextApiHandler } from 'next'

const { ADMIN_PASSWORD_SHA512_HASHED, ADMIN_PASSWORD_SALT } = process.env

/**
 * 로그인을 처리하는 API입니다.
 *
 * 입력받은 비밀번호를 해시와 비교합니다.
 * 만약 일치할경우 토큰을 발급하고 쿠키에 저장합니다.
 */
const API: NextApiHandler = (req, res) => {
  if (req.method !== 'POST') return res.send({ success: false })

  const { password } = req.body
  if (!password) return res.send({ success: false })

  const hashed =
    shajs('sha512')
      .update(`${ADMIN_PASSWORD_SALT}${password}`)
      .digest('hex')

  if (ADMIN_PASSWORD_SHA512_HASHED !== hashed) {
    return res.send({ success: false })
  }

  res
    .setHeader('Set-Cookie', `token=${tokenSign()}; path=/;`)
    .send({ success: true })
}

export default API
