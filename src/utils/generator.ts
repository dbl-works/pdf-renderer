import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer'
import StoreFile from './storeFile'
import Options from '../models/options'

export default class Generator {
  content: string;

  options: Options;

  constructor(content: string, options?: Options) {
    this.content = content
    this.options = options || new Options()
  }

  async execute(): Promise<void> {
    const pdfContent: Buffer = await this.generatePDF()

    if (!pdfContent) {
      // eslint-disable-next-line no-console
      console.log('Failed to generate PDF content.')
      return
    }

    if (this.options.saveFile === true) {
      // Storing the file in S3
      StoreFile.store(pdfContent, this.options.filename)
    } else {
      this.options.pdfMarkup = pdfContent.toString('base64')
    }
  }

  static async healthCheck(): Promise<boolean> {
    const content = '<h1>PDF Generator is running!</h1>'
    const generator = new Generator(
      content,
    )

    const pdfContent = await generator.generatePDF()
    return !!pdfContent.length
  }

  private async generatePDF(): Promise<Buffer> {
    let pdfContent: Buffer
    let browser: Browser | undefined
    const isLocal = process.env.NODE_ENV === 'development'
    let puppeteerOptions: Record<string, string | string[]>

    // locally (at least on macOS), puppeteer can detect the correct path automatically,
    // which is probably found at /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
    // if we pass the default for Linux, puppeteer fails.
    if (isLocal) {
      puppeteerOptions = {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
    } else {
      puppeteerOptions = {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: 'google-chrome-stable',
      }
    }

    // https://developer.chrome.com/articles/new-headless/
    puppeteerOptions.headless = 'new'

    try {
      browser = await puppeteer.launch(puppeteerOptions)
      const page: Page = (await browser.pages())[0]
      const defaultOptions: PDFOptions = {
        format: 'a4',
        landscape: this.options.format.landscape,
        printBackground: true,
      }

      // Assign the provided content to the page
      await page.setContent(this.content)

      pdfContent = Buffer.from(await page.pdf(defaultOptions))
      await browser.close()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating PDF:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        content_length: this.content.length,
        timestamp: new Date().toISOString(),
      })
      pdfContent = Buffer.from('')
    } finally {
      if (browser) await browser.close()
    }

    return new Promise<Buffer>((resolve) => {
      resolve(pdfContent)
    })
  }
}
