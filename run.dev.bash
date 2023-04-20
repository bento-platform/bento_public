#!/usr/bin/env bash

export BENTO_PUBLIC_STATIC_FILES_PATH=/bento-public/build/www

cd /bento-public || exit

# Install/update node dependencies
npm install

# Build dev before starting the go webserver.
# main.go uses Echo's Static middleware to route static files.
# The files MUST exist when the middleware is registered.
npm run build-dev

# Run nodemon as a watcher to recompile Go
npx nodemon main.go &

# Run webpack watch to recompile JS files
npm run watch &
echo "====================== WEBPACK WATCHING ======================"

wait
