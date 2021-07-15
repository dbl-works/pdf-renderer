# PDF Render

It's an HTTP service that will convert a HTML string to PDF. It uses [Puppeteer](https://pptr.dev/) under the hood, which means rendering is performed by Chromium's render engine; thus the HTML sent to this service should be developed and tested using Chrome/Chromium.

Read more about technical details of Puppeteer on their [Github repo](https://github.com/puppeteer/puppeteer).

## Installation

Because it's a docker image, it can be installed anywhere

To try out locally:

```shell
docker build -t pdf-render-service .
docker run --name pdf-render -d -p 5000:5000 pdf-render-service
```

if you prefer `docker-compose`

```shell
docker-compose build
docker-compose up
```

If you prefer running the code in your system

```shell
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
saveFile=true
```

### Parameters
**content(required)** - String - Html markup that will be converted to a PDF

**saveFile(optional)** - Boolean, `true` by default - Whether it should respond with a base64 encoded string for the pdf (e.g. to attach to an email provider) or upload the file as PDF to AWS S3

**filename(optional)** - String, current timestamp by default - The filename that the PDF file will be created.


## Infrastructure

We manage all resources via Terraform.

```shell
terraform -chdir=terraform init
terraform -chdir=terraform apply
```

## Deployment

### Using AWS ECR as container registry
```shell
docker build -t localhost/pdf-render-service .

git fetch --all --tags
LATEST_RELEASE="$(git describe --abbrev=0 --tags)"
AWS_REGION=eu-central-1
AWS_PROFILE=
AWS_ACCOUNT_ID=

aws ecr get-login-password --profile $AWS_PROFILE --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
docker tag localhost/pdf-render-service $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/pdf-render-service:$LATEST_RELEASE
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/pdf-render-service:$LATEST_RELEASE
```
