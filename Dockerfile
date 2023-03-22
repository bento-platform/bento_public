FROM --platform=$BUILDPLATFORM node:18-alpine3.17 as nodebuilder

RUN mkdir /node
COPY . /node
WORKDIR /node

RUN npm install

RUN mkdir -p build/www
RUN npm run build-dev


FROM golang:1.19-bullseye as gobuilder

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y git

WORKDIR /build
COPY . .
RUN go build -o ./reactapp


FROM ghcr.io/bento-platform/bento_base_image:plain-debian-2023.02.27

RUN mkdir -p /bento-public/www

COPY --from=nodebuilder /node/build/www /bento-public/www
COPY --from=nodebuilder /node/package.json /bento-public/package.json

# Server
COPY --from=gobuilder /build/reactapp /bento-public/reactapp

ENV BENTO_PUBLIC_PACKAGE_JSON_PATH=/bento-public/package.json

WORKDIR /bento-public

COPY entrypoint.bash .

ENTRYPOINT [ "/bin/bash", "./entrypoint.bash" ]
CMD [ "./reactapp" ]
