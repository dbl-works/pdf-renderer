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
