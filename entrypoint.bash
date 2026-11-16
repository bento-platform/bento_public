#!/bin/bash

cd /bento-public || exit

# Create bento_user + home
source /create_service_user.bash

# Fix permissions on /bento-public, only touching files not already owned by bento_user.
prune_args=()
if [[ -d node_modules && "$(stat -c '%U' node_modules)" == "bento_user" ]]; then
  prune_args=(-path /bento-public/node_modules -prune -o)
fi
find /bento-public "${prune_args[@]}" \! -user bento_user -exec chown bento_user:bento_user {} + 2>/dev/null || true

# Configure git, since we override the default entrypoint
gosu bento_user /bin/bash -c '/set_gitconfig.bash'

# Drop into bento_user from root and execute the CMD specified for the image
exec gosu bento_user "$@"
