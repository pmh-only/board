// from https://chadalen.com/blog/how-to-use-a-multipart-form-in-nextjs-using-api-routes

import nextConnect from 'next-connect'
import multipartFormParser from './multipart-form-parser'

const middleware = nextConnect()

middleware.use(multipartFormParser)

export default middleware
