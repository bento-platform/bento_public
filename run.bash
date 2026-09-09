#!/bin/bash

# Next.js's standalone server reads PORT/HOSTNAME directly (there's no -p flag to pass here, unlike
# `next start`).
export PORT="${BENTO_PUBLIC_PORT:-5000}"
export HOSTNAME="0.0.0.0"

echo "[bento_public] [entrypoint] starting Next.js on port ${PORT}"
exec node server.js
