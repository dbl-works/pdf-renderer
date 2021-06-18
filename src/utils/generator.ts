import puppeteer from 'puppeteer'
import { Page, Browser, PDFOptions } from 'puppeteer'
import { StoreFile } from './storeFile'

export class Generator {
  content: string
  filename: string
  saveFile: boolean

  constructor(content: string, filename: string = `pdf_${Date.now}`, saveFile: boolean = true) {
      this.content = content
      this.filename = filename
      this.saveFile = saveFile
  }

  async execute(): Promise<string> {
    let result: string = ''
    
    const pdfContent: Buffer = await this.generatePDF()
    result = pdfContent.toString('base64')

    if (this.saveFile == true) {
      // Storing the file in S3
      StoreFile.store(pdfContent, this.filename)
    }

    return new Promise<string>( resolve => { resolve(result) })
  }
 
  private async generatePDF(): Promise<Buffer> {
    let pdfContent: Buffer
    let browser: Browser

    try {
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        executablePath: 'google-chrome-stable'
      })

      const page: Page = await browser.newPage()
      const defaultOptions: PDFOptions = { printBackground: true, format: 'a4' }

      // Assign the provided content to the page
      await page.setContent(this.content)

      pdfContent = await page['pdf'](defaultOptions)
      browser.close()

    } catch (e) {
      console.log(`Error generating the PDF: ${e}`)
    } finally {
      return new Promise<Buffer>(resolve => { resolve(pdfContent) })
    }
  }
}