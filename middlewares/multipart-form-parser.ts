// from https://chadalen.com/blog/how-to-use-a-multipart-form-in-nextjs-using-api-routes

import formidable, { Files } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'

const form = formidable({ multiples: true }) // multiples means req.files will be an array

export default async function multipartFormParser (req: NextApiRequest & { files: Files }, res: NextApiResponse, next: NextHandler) {
  const contentType = req.headers['content-type']
  if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    form.parse(req, (err, fields, files) => {
      if (!err) {
        req.body = fields // sets the body field in the request object
        req.files = files // sets the files field in the request object
      }
      next() // continues to the next middleware or to the route
    })
  } else {
    next()
  }
}
