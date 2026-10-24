FROM node:26.12.1-bookworm-slim

RUN apt-get update \
    && apt-get install --yes --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/* \
    && npm install --global npm@11.20.0 \
    && git config --system core.autocrlf true
