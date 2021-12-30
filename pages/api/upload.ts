import { tokenVerify } from '../../utils/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import multipartFormParser from '../../middlewares/multipart-form-parser'

import { v4 as uuid } from 'uuid'
import { readFileSync } from 'fs'

const handler = nextConnect()

handler.use(multipartFormParser)

handler.post(async (req: NextApiRequest & { files: any }, res: NextApiResponse) => {
  const { token } = req.cookies

  if (!token) {
    return res.send({ success: false })
  }

  if (!tokenVerify(token)) {
    return res.send({ success: false })
  }

  const s3 = new S3Client({
    region: process.env.AWS_S3_REGION
  })

  if (!req.files?.file?.originalFilename) {
    return res.send({ success: false })
  }

  const key = `uploads/${uuid()}-${req.files.file.originalFilename}`

  const uploadRequest = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: readFileSync(req.files.file.filepath)
  })

  await s3.send(uploadRequest)

  return res.send({ success: true, url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}` })
})

export const config = { api: { bodyParser: false } }
export default handler
