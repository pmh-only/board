import jwt, { JwtPayload } from 'jsonwebtoken'

const issuer = `pmh-only/board$${process.env.NEXT_PUBLIC_SITE_NAME}`

export function tokenVerify (token: string, subject = process.env.NEXT_PUBLIC_ADMIN_USERNAME!) {
  try {
    jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS512'],
      issuer,
      subject
    })
    return true
  } catch (_) {
    return false
  }
}

export function tokenVerifyAndGetSubject (token: string) {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS512'],
      issuer
    }) as JwtPayload
    return data.sub
  } catch (_) {
    return false
  }
}

export function tokenSign (subject = process.env.NEXT_PUBLIC_ADMIN_USERNAME!) {
  return jwt.sign({}, process.env.JWT_SECRET!, {
    algorithm: 'HS512',
    expiresIn: '1d',
    notBefore: '0s',
    subject,
    issuer
  })
}
