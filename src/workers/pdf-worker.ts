import puppeteer, { Browser, PDFOptions } from 'puppeteer'

interface WorkerData {
  content: string
  isLocal: boolean
  format: {
    landscape: boolean
  }
}

// Browser instance is scoped to the worker thread
let browser: Browser | undefined

async function getBrowser(isLocal: boolean): Promise<Browser> {
  if (!browser) {
    const puppeteerOptions: Record<string, string | string[]> = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
      ],
      headless: 'new', // https://developer.chrome.com/articles/new-headless/
    }

    if (!isLocal) {
      puppeteerOptions.executablePath = 'google-chrome-stable'
    }

    browser = await puppeteer.launch(puppeteerOptions)

    // Close the default blank page
    const pages = await browser.pages()
    if (pages.length > 0) {
      await pages[0].close()
    }
  }
  return browser
}

export default async function generatePDF({ content, isLocal, format }: WorkerData): Promise<string> {
  try {
    const browser = await getBrowser(isLocal)
    const page = await browser.newPage()

    try {
      const defaultOptions: PDFOptions = {
        format: 'a4',
        landscape: format.landscape,
        printBackground: true,
      }

      await page.setContent(content)
      const pdf = await page.pdf(defaultOptions)
      return Buffer.from(pdf).toString('base64')
    } finally {
      await page.close()
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Worker Error generating PDF:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      content_length: content.length,
      timestamp: new Date().toISOString(),
    })

    // If browser error, clear the instance so it's recreated next time
    if (browser) {
      await browser.close()
      browser = undefined
    }

    return ''
  }
}

// Clean up browser on worker exit
process.on('exit', async () => {
  if (browser) {
    await browser.close()
  }
})
