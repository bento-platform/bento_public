FROM --platform=$BUILDPLATFORM node:18-alpine3.16 as nodebuilder

RUN mkdir /node
COPY . /node
WORKDIR /node

RUN npm install

RUN mkdir -p build/www
RUN npm run build-dev


FROM golang:1.20-bullseye as gobuilder

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y git

WORKDIR /build
COPY . .
RUN go build -o ./reactapp

RUN ls -lah


FROM ghcr.io/bento-platform/bento_base_image:plain-debian-2023.02.23

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y bash gosu && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /runner/www

COPY --from=nodebuilder /node/build/www /runner/www
COPY --from=nodebuilder /node/package.json /runner/package.json

# Server
COPY --from=gobuilder /build/reactapp /runner/reactapp

ENV BENTO_PUBLIC_PACKAGE_JSON_PATH=/runner/package.json

WORKDIR /runner

COPY entrypoint.bash .

ENTRYPOINT [ "/bin/bash", "./entrypoint.bash" ]
CMD [ "./reactapp" ]
