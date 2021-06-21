import express from 'express'
import { Request, Response, Application } from 'express'
import { Generator } from './utils/generator'

const app: Application = express();
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}))

app.get("/", (req: Request, res: Response) => {
  return res.send(`API Running...${req.query.content}`);
});

app.post('/', async(req: Request, res: Response) => {
  const pdfGenerator = new Generator(req.body.content, req.body.filename, req.body.saveFile == 'true')
  const result = await pdfGenerator.execute()
  if (pdfGenerator.saveFile) {
    res.json( { filename: pdfGenerator.filename })
  } else {
    res.json({ content: pdfGenerator.pdfMarkup })
  }
  
})

app.listen(5000, () => {
    console.log(
      ` 📡 Backend server: ` +
      ` Running in dev mode on port ${5000}`
    )
  }
)