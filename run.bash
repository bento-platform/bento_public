#!/bin/bash

CONFIG_FILE="dist/public/config.js"
SERVICE_INFO_FILE="dist/public/service-info.json"

# ----- Begin instance config creation --------------------------------
echo "[bento_public] [entrypoint] writing ${CONFIG_FILE}"
node ./create_config_prod.js # Echo out to logs
node ./create_config_prod.js > "${CONFIG_FILE}"
# ----- End -----------------------------------------------------------

# ----- Begin /service-info creation ----------------------------------
echo "[bento_public] [entrypoint] writing ${SERVICE_INFO_FILE}"
node ./create_service_info.js > "${SERVICE_INFO_FILE}"
# ----- End -----------------------------------------------------------

echo "[bento_public] [entrypoint] starting NGINX"
nginx -g 'daemon off;'
