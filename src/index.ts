import express, { Request, Response, Application } from 'express'
import Generator from './utils/generator'

const app: Application = express()
app.use(express.json({ limit: '50mb' }))
app.get('/', (req: Request, res: Response) => res.send(`API Running...${req.query.content}`))

// default health check endpoint for ECS tasks
app.get('/healthz', (req: Request, res: Response) => res.send('\u2713'))

app.post('/', async (req: Request, res: Response) => {
  const pdfGenerator = new Generator(req.body.content, req.body.filename, req.body.saveFile)

  await pdfGenerator.execute()
  if (pdfGenerator.saveFile) {
    res.json({ filename: pdfGenerator.filename })
  } else {
    res.json({ content: pdfGenerator.pdfMarkup })
  }
})

app.listen(5000, () => {
  console.log(
    ' 📡 Backend server: '
    + ` Running in dev mode on port ${5000}`,
  )
})
