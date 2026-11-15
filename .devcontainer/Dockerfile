FROM node:26.12.1-bookworm-slim

ARG HUGO_VERSION=0.170.0

RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates curl git \
    && curl --fail --location --silent --show-error \
        --output /tmp/hugo.deb \
        "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-amd64.deb" \
    && apt-get install --yes /tmp/hugo.deb \
    && rm --force /tmp/hugo.deb \
    && rm -rf /var/lib/apt/lists/* \
    && npm install --global npm@11.20.0 \
    && git config --system core.autocrlf true
