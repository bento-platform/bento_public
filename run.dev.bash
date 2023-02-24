#!/usr/bin/env bash

cd /bento-public || exit

ls -la

# Install/update node dependencies
npm install

# Run nodemon as a watcher to recompile JS + Go
#  - add 500ms delay to try to prevent port binding issues
npx nodemon --exec go run main.go --signal SIGTERM --delay 500ms &

# Run webpack watch to recompile JS files
npm run watch &

wait
