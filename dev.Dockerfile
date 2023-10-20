FROM ghcr.io/bento-platform/bento_base_image:node-debian-2023.10.20

RUN apt-get update -y && \
    apt-get install -y ca-certificates

# Use bookworm-backports to get go 1.21 instead of 1.19
# Install lsof to help killing the PID binding the port if needed
RUN echo "deb https://deb.debian.org/debian bookworm-backports main contrib non-free" >> /etc/apt/sources.list &&\
    echo "deb-src https://deb.debian.org/debian bookworm-backports main contrib non-free" >> /etc/apt/sources.list && \
    apt-get update -y && \
    apt-get upgrade -y && \
    apt-get -t bookworm-backports install -y golang-go lsof && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /bento-public

COPY package.json .
COPY package-lock.json .

# Install NPM dev/prod dependencies to get Nodemon - we will need to fix the permissions of node_modules after
RUN npm ci

# Don't copy code in, since we expect it to be mounted via volume

COPY entrypoint.bash .
COPY run.dev.bash .
COPY nodemon.json .

ENTRYPOINT [ "bash", "./entrypoint.bash" ]
CMD [ "bash", "./run.dev.bash" ]
