FROM node:20-bullseye-slim

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
  # Clean up
  && apt-get purge --auto-remove -y wget gnupg \
  && rm -rf /var/lib/apt/lists/*

# Set environment variable to skip the chromium download.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Add user for running the application
RUN groupadd -r pptruser \
 && useradd -r -g pptruser -G audio,video pptruser \
 && mkdir -p /home/pptruser/Downloads \
 && chown -R pptruser:pptruser /home/pptruser

WORKDIR /usr/src/app

# Copy package.json and yarn.lock first to leverage Docker cache
COPY --chown=pptruser:pptruser package.json yarn.lock ./

# Install dependencies
ARG NODE_ENV=production
RUN yarn install --frozen-lockfile --production

# Copy the application source code
COPY --chown=pptruser:pptruser . .

# Run the application as non-privileged user
USER pptruser

EXPOSE 5017

CMD ["yarn", "run", "production"]
