#!/bin/sh

# clean & prepare output directories
rm -rf build
mkdir -p build/www

# build react bundle.js
npm run build-dev

# - load (export) .env
set -a
. server.env
set +a

# - run
export BENTO_PUBLIC_STATIC_FILES_PATH="$PWD/build/www"
go run main.go
