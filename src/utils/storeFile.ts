import S3 from 'aws-sdk/clients/s3'

export default function storeFile(content: Buffer, filename: string): Promise<S3.ManagedUpload.SendData> {
  try {
    const s3 = new S3()

    if (process.env.AWS_BUCKET_NAME === undefined) {
      throw new Error('AWS_BUCKET_NAME environment variable not available')
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: content,
      ContentType: 'application/pdf',
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (error: Error, data: S3.ManagedUpload.SendData) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
