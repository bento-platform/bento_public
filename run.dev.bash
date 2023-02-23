#!/usr/bin/env bash

cd /bento-public || exit

ls -la

# Install/update node dependencies
npm install

# Run nodemon as a watcher to recompile JS + Go
npx nodemon --exec go run main.go --signal SIGTERM &

# Run webpack watch to recompile JS files
npm run watch &

wait
