# PDF Render

It's an HTTP service that will convert an html into PDF

## Installation

Because it's a docker image, it can be installed anywhere

To try out locally:

```
docker build -t pdf-render-service .
docker run --name pdf-render -d -p 5000:5000 pdf-render-service
```
if you prefer `docker-compose`

```
docker-compose build
docker-compose up
```

## API Reference

Generate a PDF from HTML markup

```
POST / 
content="<div>Hello World</div>"
filename="pdf_example.pdf"
toBase64=true
```

### Parameters
**content(required)** - String - Html markup that will be converted to a PDF

**toBase64** - Boolean - Whether it should respond with a base64 encoded string for the pdf (e.g. to attach to an email provider)

**filename** - String - The filename that the PDF file will be created.

