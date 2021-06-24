import puppeteer, { Page, Browser, PDFOptions } from 'puppeteer'

import storeFile from './storeFile'

const validateFilename = (filename: string): string => {
  if (!filename.match(/\.pdf$/i)) {
    return `${filename}.pdf`
  }

  return filename
}

export default class Generator {
  content: string

  filename: string

  saveFile: boolean

  pdfMarkup: string

  constructor(content: string, filename = `${Date.now()}`, saveFile = true) {
    this.content = content
    this.filename = validateFilename(filename)
    this.saveFile = saveFile
    this.pdfMarkup = ''
  }

  async execute(): Promise<void> {
    const pdfContent: Buffer = await this.generatePDF()

    if (this.saveFile) {
      // Storing the file in S3
      storeFile(pdfContent, this.filename)
    } else {
      this.pdfMarkup = pdfContent.toString('base64')
    }
  }

  private async generatePDF(): Promise<Buffer> {
    let pdfContent: Buffer
    let browser: Browser

    try {
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
        executablePath: 'google-chrome-stable',
      })

      const page: Page = await browser.newPage()
      const defaultOptions: PDFOptions = { printBackground: true, format: 'a4' }

      // Assign the provided content to the page
      await page.setContent(this.content)

      pdfContent = await page.pdf(defaultOptions)
      browser.close()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Error generating the PDF: ${e}`)
    }

    return new Promise<Buffer>((resolve) => { resolve(pdfContent) })
  }
}
