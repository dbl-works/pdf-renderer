import Piscina from 'piscina'
import { resolve } from 'path'
import StoreFile from './storeFile'
import Options from '../models/options'

export const pool = new Piscina({
  filename: resolve(__dirname, '../workers/pdf-worker.js'),
  // Leave one CPU for the main thread
  maxThreads: Math.max(1, require('os').cpus().length - 1),
})

export default class Generator {
  content: string

  options: Options

  constructor(content: string, options?: Options) {
    this.content = content
    this.options = options || new Options()
  }

  async execute(): Promise<void> {
    const pdfContent = await this.generatePDF()

    if (!pdfContent) {
      // eslint-disable-next-line no-console
      console.log('Failed to generate PDF content.')
      return
    }

    if (this.options.saveFile === true) {
      // Storing the file in S3 - convert base64 back to Buffer for S3
      const pdfBuffer = Buffer.from(pdfContent, 'base64')
      StoreFile.store(pdfBuffer, this.options.filename)
    } else {
      // Already base64, just assign
      this.options.pdfMarkup = pdfContent
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      // Just check if the pool is available
      return !pool.needsDrain && pool.threads.length > 0
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error checking health:', error)
      return false
    }
  }

  private async generatePDF(): Promise<string> {
    const isLocal = process.env.NODE_ENV === 'development'

    try {
      return await pool.run({
        content: this.content,
        isLocal,
        format: this.options.format,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating PDF:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        content_length: this.content.length,
        timestamp: new Date().toISOString(),
      })
      return ''
    }
  }
}
