import express, { Request, Response, Application } from 'express'
import Generator from './utils/generator'
import Options from './models/options'
import Format from './models/format'

const app: Application = express()
app.use(express.json({ limit: '50mb' }))
app.get('/', (req: Request, res: Response) => res.send(`API Running...${req.query.content}`))

// health check endpoint for e.g. ECS tasks, following Kubernetes standards
// see: https://kubernetes.io/docs/reference/using-api/health-checks/
app.get(['/healthz', '/livez', '/readyz'], async (req: Request, res: Response) => {
  const ok = await Generator.healthCheck()
  return ok ? res.send('\u2713') : res.status(500).send('\u2717')
})

// @TODO: respond with error code if something goes wrong rather than an empty string
app.post('/', async (req: Request, res: Response) => {
  const options = new Options(
    req.body.filename,
    req.body.saveFile,
    new Format(req.body.format),
  )

  const pdfGenerator = new Generator(req.body.content, options)

  await pdfGenerator.execute()

  return options.saveFile
    ? res.json({ filename: options.filename })
    : res.json({ content: options.pdfMarkup })
})

// @NOTE: macOS Monterey runs the ControlCenter on port 5000
const PORT = process.env.PORT || 5017

app.listen(PORT, () => {
  const mode = process.env.NODE_ENV || 'dev'
  // eslint-disable-next-line no-console
  console.log(`📡 Backend server: Running in ${mode} mode on port ${PORT}`)
})
