#!/bin/sh

# prepare output directories
mkdir -p build/www
# - prepare server .env
cp server.env build/.env

# go to src directory and build go binary
cd src
go build -o ../build/reactapp

# build react bundle.js
cd ../
npm run build

# start go http server
cd build
# - load (export) .env
set -a
. ./.env
set +a
# - run
./reactapp