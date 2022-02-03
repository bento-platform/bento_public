FROM node:12-alpine3.14 as nodebuilder

RUN mkdir /node
COPY . /node
WORKDIR /node

RUN npm install

RUN mkdir -p build/www
RUN npm run build


FROM golang:1.16.13-alpine3.15 as gobuilder

RUN apk update && \
    apk upgrade && \
    apk add git

RUN mkdir /build
COPY . /build
WORKDIR /build/src
RUN export GO111MODULE=off && \
    export GOPATH=/go && \
    export GOBIN=$GOPATH/bin && \
    go get . && \
    go build -o ./reactapp

RUN ls -lah


FROM alpine:3.7

RUN apk update && \
    apk upgrade

RUN mkdir -p /runner/www

# Client
COPY --from=nodebuilder /node/build/www /runner/www
COPY --from=nodebuilder /node/src/index.html /runner/www

# Server
COPY --from=gobuilder /build/src/reactapp /runner
WORKDIR /runner
ENTRYPOINT [ "./reactapp" ]

