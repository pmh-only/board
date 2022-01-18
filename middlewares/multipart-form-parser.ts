// from https://chadalen.com/blog/how-to-use-a-multipart-form-in-nextjs-using-api-routes

import { NextHandler } from 'next-connect'
import formidable, { Files } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'

const form = formidable({ multiples: true })

/**
 * formData를 처리하기 위한 API입니다
 */
const API = async (req: NextApiRequest & { files: Files }, _: NextApiResponse, next: NextHandler) => {
  const contentType = req.headers['content-type']

  if (!contentType || !contentType.includes('multipart/form-data')) {
    return next()
  }

  form.parse(req, (err, fields, files) => {
    if (!err) { req.body = fields; req.files = files }
    next()
  })
}

export default API
