FROM --platform=$BUILDPLATFORM node:18-alpine3.16 as nodebuilder

RUN mkdir /node
COPY . /node
WORKDIR /node

RUN npm install

RUN mkdir -p build/www
RUN npm run build-dev


FROM golang:1.19-alpine3.16 as gobuilder

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


FROM alpine:3.16

RUN apk update && \
    apk upgrade

RUN mkdir -p /runner/www

COPY --from=nodebuilder /node/build/www /runner/www

# Server
COPY --from=gobuilder /build/src/reactapp /runner


WORKDIR /runner
ENTRYPOINT [ "./reactapp" ]
