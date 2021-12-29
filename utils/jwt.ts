import jwt from 'jsonwebtoken'

const issuer = `pmh-only/board$${process.env.NEXT_PUBLIC_SITE_NAME}`

export function tokenVerify (token: string) {
  try {
    jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS512'],
      issuer
    })
    return true
  } catch (_) {
    return false
  }
}

export function tokenSign () {
  return jwt.sign({}, process.env.JWT_SECRET!, {
    algorithm: 'HS512',
    expiresIn: '1d',
    notBefore: '0s',
    subject: 'admin',
    issuer
  })
}
