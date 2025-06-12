import puppeteer, { Browser, PDFOptions } from 'puppeteer'
import { execSync } from 'child_process'

interface WorkerData {
  content: string
  isLocal: boolean
  format: {
    landscape: boolean
  }
}

// Browser instance is scoped to the worker thread
let browser: Browser | undefined

// Store Chrome path globally
let chromePath: string | undefined

// Find Chrome path at startup
function findChromePath(): string {
  // For Docker/Linux where we install Chrome directly
  const defaultPath = '/usr/bin/google-chrome-stable'

  try {
    execSync(`test -x ${defaultPath}`).toString().trim()
    return defaultPath
  } catch (error) {
    console.warn(`Default Chrome path not found: ${defaultPath}. Trying other methods...`)
  }

  // Try finding chrome in PATH, usually the case on dev machines
  const chromeCommands = [
    'which google-chrome-stable',
    'which chromium'
  ]

  for (const command of chromeCommands) {
    try {
      const path = execSync(command).toString().trim()
      if (path) return path
    } catch (error) {
      continue
    }
  }

  // Finally, try puppeteer's bundled Chromium
  try {
    return require('puppeteer').executablePath()
  } catch (error) {
    console.error('Error finding Chrome path:', error)
  }

  throw new Error('Could not find a valid Chrome executable. Please ensure Chrome is installed or specify the path explicitly.')
}

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
      // Initialize chrome path if not already set
      chromePath = chromePath || findChromePath()
      puppeteerOptions.executablePath = chromePath
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
