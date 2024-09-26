#!/usr/bin/env bash

# Base image handles making bento_user and setting its .gitconfig

# Set default internal port to 80
: "${BENTO_PUBLIC_PORT:=80}"
export BENTO_PUBLIC_PORT

# ----- Begin /service-info creation ----------------------------------
echo "[bento_public] [entrypoint] creating service-info file"
node ./create_service_info.js > dist/public/service-info.json
# ----- End -----------------------------------------------------------

echo "[bento_public] [entrypoint] running npm install"
npm install

echo "[bento_public] [entrypoint] starting"
npm run start
