#!/usr/bin/env bash

cd /bento-public || exit

ls -la

# Install/update node dependencies
npm install

# Run nodemon as a watcher to recompile Go
npx nodemon main.go

# Run webpack watch to recompile JS files
npm run watch &

wait
