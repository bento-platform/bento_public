FROM --platform=$BUILDPLATFORM node:20-bookworm-slim as nodebuilder

WORKDIR /node

# Install using just package-lock.json with npm ci
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Build the web application
COPY tsconfig.json .
COPY webpack.config.js .
COPY src src
RUN mkdir -p build/www
RUN npm run build


FROM golang:1.21-bookworm as gobuilder

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y git

WORKDIR /build

# Only copy the files that are needed!
COPY go.mod .
COPY go.sum .
COPY main.go .

RUN go build -o ./reactapp


FROM ghcr.io/bento-platform/bento_base_image:node-debian-2024.07.09

ENV BENTO_PUBLIC_PACKAGE_JSON_PATH=/bento-public/package.json
WORKDIR /bento-public

COPY entrypoint.bash .
COPY package.json .
COPY create_config_prod.js .
COPY run.bash .

# Copy web app
COPY --from=nodebuilder /node/build/www /bento-public/www

# Copy server
COPY --from=gobuilder /build/reactapp /bento-public/reactapp

ENTRYPOINT [ "/bin/bash", "./entrypoint.bash" ]
CMD [ "/bin/bash", "./run.bash" ]
