export const AUTHORIZE_URL = (clientId = '') =>
  `https://github.com/login/oauth/authorize?client_id=${clientId}`

export const ACCESS_TOKEN_URL =
  'https://github.com/login/oauth/access_token'

export const USER_INFO_URL =
  'https://api.github.com/user'
