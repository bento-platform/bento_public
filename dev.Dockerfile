FROM --platform=$BUILDPLATFORM node:22-bookworm-slim AS install

WORKDIR /bento-public

COPY package.json .
COPY package-lock.json .

RUN npm ci

FROM ghcr.io/bento-platform/bento_base_image:node-debian-2025.03.01

LABEL org.opencontainers.image.description="Local development image for Bento Public."

WORKDIR /bento-public

COPY entrypoint.bash .
COPY run.dev.bash .
COPY package.json .
COPY package-lock.json .

COPY --from=install /bento-public/node_modules ./node_modules

ENTRYPOINT [ "/bin/bash", "./entrypoint.bash" ]
CMD [ "/bin/bash", "./run.dev.bash" ]
