import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default class StoreFile {
  static store(content: Buffer, filename: string): void {
    try {
      const s3Client = new S3Client()
      if (process.env.AWS_BUCKET_NAME === undefined) {
        throw new Error('AWS_BUCKET_NAME environment variable not available')
      }

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: content,
        ContentType: 'application/pdf',
      }

      const command = new PutObjectCommand(params)
      s3Client.send(command).then(() => {
        console.log(`Successfully uploaded data to ${params.Bucket}/${params.Key}`)
      }).catch((error) => {
        console.error(`Error when uploading to S3: ${error}`)
      })
    } catch (e) {
      console.log(`Error when uploading to S3: ${e}`)
    }
  }
}
