# PDF Renderer

https://hub.docker.com/repository/docker/dblworks/pdf-renderer


It's an HTTP service that will convert a HTML string to PDF. It uses [Puppeteer](https://pptr.dev/) under the hood, which means rendering is performed by Chromium's render engine; thus the HTML sent to this service should be developed and tested using Chrome/Chromium.

Read more about technical details of Puppeteer on their [Github repo](https://github.com/puppeteer/puppeteer).



## Installation

Because it's a docker image, it can be installed anywhere

To try out locally:

```shell
docker build -t pdf-renderer .
docker run --name pdf-renderer -d -p 5017:5017 pdf-renderer
```

If you prefer running the code in your system

:warning: macOS Monterey runs the ControlCenter on port 5000.

Prepend e.g. `PORT=5017` to the command

```shell
yarn run dev
```

or

```shell
yarn run local
```

which runs `NODE_ENV=development yarn run dev`.

Passing `NODE_ENV=development` will let puppeteer auto-detect the executable path, which is different from the hardcoded path, that is specifc for a Linux deploy.

```javascript
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
        // executablePath: 'google-chrome-stable',
      })
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
format={"landscape": false}
```

### Parameters
**content(required)** - String - Html markup that will be converted to a PDF

**saveFile(optional)** - Boolean, `true` by default - Whether it should respond with a base64 encoded string for the pdf (e.g. to attach to an email provider) or upload the file as PDF to AWS S3

**filename(optional)** - String, current timestamp by default - The filename that the PDF file will be created.

**format(optional)** - Object, `{}` by default.
```json
{
  "landscape": false, // - Boolean, `false` by default - Whether the PDF should be in landscape mode
}
```



## Building

On a x86 chip
```shell
docker build -t dblworks/pdf-renderer:$TAGNAME .
```

On a ARM chip (for a x86 target):

```shell
docker build -t dblworks/pdf-renderer:$TAGNAME . --platform amd64
```



## Publishing

```shell
git fetch --all --tags
TAGNAME="$(git describe --abbrev=0 --tags)"

docker push dblworks/pdf-renderer:$TAGNAME
```



## Deployment

### Using AWS ECR as container registry
```shell
yarn build

docker build -t localhost/pdf-renderer .

git fetch --all --tags
LATEST_RELEASE="$(git describe --abbrev=0 --tags)"
AWS_REGION=eu-central-1
AWS_PROFILE=
AWS_ACCOUNT_ID=

aws ecr get-login-password --profile $AWS_PROFILE --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
docker tag localhost/pdf-renderer $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/pdf-renderer:$LATEST_RELEASE
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/pdf-renderer:$LATEST_RELEASE
```
