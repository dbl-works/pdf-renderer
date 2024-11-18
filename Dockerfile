FROM node:22-bullseye-slim

# Install dependencies and Google Chrome
# Also install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
#
# https://www.google.com/linuxrepositories/
#
RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
    libxss1 \
    google-chrome-stable \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
  && rm -rf /var/lib/apt/lists/*

# Set environment variable to skip the chromium download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
ARG NODE_ENV=production
RUN yarn install --frozen-lockfile --production

# Copy the application source code
COPY . .

EXPOSE 5017

CMD ["yarn", "run", "production"]
