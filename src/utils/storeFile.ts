import S3 from 'aws-sdk/clients/s3'

export class StoreFile {
    static store(content: Buffer, filename: string) {
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

            s3.upload(params, (error: any, data: any) => { console.log(error, data) })
        } catch (e) {
            console.log(`Error when uploading to S3: ${e}`)
        }
    }
}
