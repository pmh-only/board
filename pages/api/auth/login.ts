import shajs from 'sha.js'
import { tokenSign } from '../../../utils/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'

const { ADMIN_PASSWORD_SHA512_HASHED, ADMIN_PASSWORD_SALT } = process.env

export default function handler (req: NextApiRequest, res: NextApiResponse) {
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
