FROM --platform=$BUILDPLATFORM node:24-trixie-slim AS install

WORKDIR /bento-public/next-app

COPY next-app/package.json .
COPY next-app/package-lock.json .

RUN npm ci

FROM ghcr.io/bento-platform/bento_base_image:node-debian-2026.08.01

LABEL org.opencontainers.image.description="Local development image for Bento Public."

WORKDIR /bento-public

COPY entrypoint.bash .
COPY run.dev.bash .
COPY next-app/package.json next-app/package.json
COPY next-app/package-lock.json next-app/package-lock.json

COPY --from=install /bento-public/next-app/node_modules ./next-app/node_modules

ENTRYPOINT [ "/bin/bash", "./entrypoint.bash" ]
CMD [ "/bin/bash", "./run.dev.bash" ]
