# PDF Render

It's an HTTP service that will convert a HTML string to PDF

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

If you prefer running the code in your system

```
yarn run dev
```

### Environment variables
```
AWS_BUCKET_NAME
```

#### AWS

To store the files to AWS we need to config the system to use `aws-sdk`

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```
(this will need to be provided to you)

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


## Infrastructure

We manage all resources via Terraform.

```shell
terraform -chdir=terraform init
terraform -chdir=terraform apply
```
