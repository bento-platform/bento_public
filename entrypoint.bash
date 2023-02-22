#!/bin/bash

cd /runner || exit

# Create bento_user + home
source /create_service_user.bash

# Fix permissions on /runner
chown -R bento_user:bento_user /runner

# Drop into bento_user from root and execute the CMD specified for the image
exec gosu bento_user "$@"
