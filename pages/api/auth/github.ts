import type { NextApiHandler } from 'next'
import { tokenSign } from '../../../utils/jwt'
import * as github from '../../../utils/github'
import { fetchJSON, fetchJSONBody } from '../../../utils/io'

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

/**
 * Github OAuth 로그인 처리를 위한 API입니다.
 *
 * code쿼리가 없을경우 로그인 페이지로 리다이렉트 처리해주며
 * code쿼리가 있을경우 인증코드를 통해 토큰을 발급받아 쿠키에 저장합니다.
 */
const API: NextApiHandler = async (req, res) => {
  const { code } = req.query

  if (!code) {
    res.redirect(github.AUTHORIZE_URL(GITHUB_CLIENT_ID))
    return
  }

  const tokenRes = await fetchJSONBody(github.ACCESS_TOKEN_URL, {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code
  })

  if (!tokenRes.access_token) {
    res.redirect(github.AUTHORIZE_URL(GITHUB_CLIENT_ID))
    return
  }

  const user = await fetchJSON(github.USER_INFO_URL, {
    headers: { Authorization: `bearer ${tokenRes.access_token}` }
  })

  if (!user.login) {
    res.redirect(github.AUTHORIZE_URL(GITHUB_CLIENT_ID))
    return
  }

  res
    .setHeader('Set-Cookie', `token=${tokenSign(user.login)}; path=/;`)
    .redirect('/login/success')
}

export default API
