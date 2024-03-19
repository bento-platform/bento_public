#!/bin/bash

CONFIG_FILE="www/public/config.js"

echo "[bento_public] [entrypoint] writing ${CONFIG_FILE}"
node ./create_config_prod.js # Echo out to logs
node ./create_config_prod.js > "${CONFIG_FILE}"

echo "[bento_public] [entrypoint] starting web server"
./reactapp
