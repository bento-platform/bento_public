#!/bin/sh

# clean & prepare output directories
rm -rf build
mkdir -p build/www

# - prepare server .env
cp server.env build/.env

# build go binary
go build -o ./build/reactapp

# build react bundle.js
npm run build-dev

# - load (export) .env
set -a
. ./build/.env
set +a

# - run
./build/reactapp
