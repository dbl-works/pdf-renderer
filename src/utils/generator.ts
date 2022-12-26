import puppeteer, { Page, Browser, PDFOptions } from 'puppeteer'
import StoreFile from './storeFile'
import Options from '../models/options'

export default class Generator {
  content: string;

  options: Options;

  constructor(content: string, options: Options) {
    this.content = content
    this.options = options
  }

  async execute(): Promise<void> {
    const pdfContent: Buffer = await this.generatePDF()

    // @TODO: return early if pdfContent is undefined (possible if generatePDF fails)

    if (this.options.saveFile === true) {
      // Storing the file in S3
      StoreFile.store(pdfContent, this.options.filename)
    } else {
      this.options.pdfMarkup = pdfContent.toString('base64')
    }
  }

  private async generatePDF(): Promise<Buffer> {
    let pdfContent: Buffer
    let browser: Browser
    const isLocal = process.env.NODE_ENV === 'development'
    let puppeteerOptions: any

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

    try {
      browser = await puppeteer.launch(puppeteerOptions)

      const page: Page = await browser.newPage()
      const defaultOptions: PDFOptions = {
        format: 'a4',
        landscape: this.options.format.landscape,
        printBackground: true,
      }

      // Assign the provided content to the page
      await page.setContent(this.content)

      pdfContent = await page.pdf(defaultOptions)
      browser.close()
    } catch (e) {
      console.log(`Error generating the PDF: ${e}`)
    }

    return new Promise<Buffer>((resolve) => {
      resolve(pdfContent)
    })
  }
}
