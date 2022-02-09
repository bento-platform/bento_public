#!/bin/sh

# prepare output directories
mkdir -p build/www
# - prepare server .env
cp server.env build/.env
cp katsu.config.json build/

# go to src directory and build go binary
cd src
go build -o ../build/reactapp

# copy root html to main build output directory
cp index.html ../build/www/index.html

# build react bundle.js
cd ../
npm run dev

# start go http server
cd build
# - load (export) .env
set -a
. ./.env
set +a
# - run
./reactapp