import express from 'express';
import { Request, Response, Application } from 'express';
import puppeteer from 'puppeteer'
import { Page, Browser, PaperFormat, PDFOptions } from 'puppeteer'

class Generator {
    async execute(content: string, filename: string) {
        try {
            const browser: Browser = await puppeteer.launch({ 
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ],
                executablePath: 'google-chrome-stable' 
            })
            console.log('After initializing browser')
            const page: Page = await browser.newPage()
            console.log('New page created')
            const defaultOptions: PDFOptions = { printBackground: true, format: 'a4' }
            console.log('Setting the content')
            await page.setContent(content)
    
            // await page.emulateMediaType('screen')
            console.log('Before generating PDF')
            await page.pdf({ path: filename, printBackground: true, format: 'a4' })
            // console.log(await (await page['pdf'](defaultOptions)).toString('base64'))
            browser.close()
        } catch (e) {
            console.log(`Error generating the PDF: ${e}`)
        }
    }
}


const app: Application = express();
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}))

app.get("/", (req: Request, res: Response) => {
    return res.send(`API Running...${req.query.content}`);
});

app.post('/', (req: Request, res: Response) => {
    const gen = new Generator();
    // let buff = Buffer.from(req.body.content, 'base64').toString('utf8');
    gen.execute(req.body.content, 'tmp/via_method.pdf');
    return res.json({ "content": req.body.content })
})

app.listen(5000, () =>
    console.log(
        ` 📡 Backend server: ` +
        ` Running in dev mode on port ${5000}`
    )
);