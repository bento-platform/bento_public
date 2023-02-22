#!/bin/sh

# clean & prepare output directories
rm -rf build
mkdir -p build/www

# - prepare server .env
cp server.env build/.env

# go to src directory and build go binary
cd src || exit
go build -o ../build/reactapp

# build react bundle.js
cd ../
npm run build-dev

# start go http server
cd build || exit

# - load (export) .env
set -a
. ./.env
set +a

# - run
./reactapp
