import type { NextApiRequest, NextApiResponse } from 'next'
import { tokenSign } from '../../../utils/jwt'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (!code) {
    res.redirect(
      'https://github.com/login/oauth/authorize?client_id=' +
      process.env.GITHUB_CLIENT_ID)
    return
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    })
  }).then((res) => res.json())

  if (!tokenRes.access_token) {
    res.redirect(
      'https://github.com/login/oauth/authorize?client_id=' +
      process.env.GITHUB_CLIENT_ID)
    return
  }

  const user = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${tokenRes.access_token}`
    }
  }).then((res) => res.json())

  if (!user.login) {
    res.redirect(
      'https://github.com/login/oauth/authorize?client_id=' +
      process.env.GITHUB_CLIENT_ID)
    return
  }

  res
    .setHeader('Set-Cookie', `token=${tokenSign(user.login)}; path=/;`)
    .redirect('/login/success')
}
