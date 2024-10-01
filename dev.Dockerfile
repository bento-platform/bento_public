FROM --platform=$BUILDPLATFORM node:20-bookworm-slim AS install

WORKDIR /bento-public

COPY package.json .
COPY package-lock.json .

RUN npm ci

FROM ghcr.io/bento-platform/bento_base_image:node-debian-2024.10.01

LABEL org.opencontainers.image.description="Local development image for Bento Public."

WORKDIR /bento-public

COPY run.dev.bash .
COPY package.json .
COPY package-lock.json .

COPY --from=install /bento-public/node_modules ./node_modules

CMD [ "bash", "./run.dev.bash" ]
