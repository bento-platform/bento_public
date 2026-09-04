FROM --platform=$BUILDPLATFORM node:24-trixie-slim AS build

# Build bento_public with Next.js
#  - Use BUILDPLATFORM for running the build, since it should perform a lot better.
#  - Then, the resulting standalone server bundle will be copied to a TARGETPLATFORM-based final image.

WORKDIR /bento-public

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json .
COPY package-lock.json .

RUN npm ci

# Explicitly choose what to copy to speed up builds
#  - Copy in build requirements
COPY next.config.ts .
COPY tsconfig.json .
#  - Copy in source code
COPY src src
COPY public public

RUN npm run build

FROM node:24-trixie-slim

LABEL org.opencontainers.image.description="Bento Public: a publicly accessible portal for clinical datasets."

WORKDIR /bento-public

ENV NEXT_TELEMETRY_DISABLED=1

# In general, we want to copy files in order of least -> most changed for layer caching reasons.

# - Copy in LICENSE so that people can see it if they explore the image contents
COPY LICENSE .
# - Copy in the run.bash, which starts the Next.js server
COPY run.bash .
# - Copy the Next.js standalone server bundle (includes its own minimal node_modules) from the build
#   stage, plus the static assets/public files that standalone output deliberately excludes
#    - copy this last, since it changes more often than everything above it
#    - this way we can cache layers
COPY --from=build /bento-public/.next/standalone ./
COPY --from=build /bento-public/.next/static ./.next/static
COPY --from=build /bento-public/public ./public

CMD [ "/bin/bash", "./run.bash" ]
