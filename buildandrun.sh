#!/bin/sh

# clean & prepare output directories
rm -rf build
mkdir -p build/www

# build react bundle.js
npm run build-dev

# - run
export BENTO_PUBLIC_STATIC_FILES_PATH="$PWD/build/www"
go run main.go
