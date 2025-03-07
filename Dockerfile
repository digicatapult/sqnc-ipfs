# syntax=docker/dockerfile:1.14

FROM golang:1.23-bookworm AS ipfs_build

ENV SRC_DIR=/go/src/github.com/ipfs/kubo
ARG TARGETPLATFORM

WORKDIR /target

ARG IPFS_TAG=NO_VALUE
RUN [ "$IPFS_TAG" != "NO_VALUE" ]

RUN echo $IPFS_TAG

RUN <<EOF
set -ex
git clone --branch "$IPFS_TAG" https://github.com/ipfs/kubo.git $SRC_DIR
cd $SRC_DIR
make build
cp $SRC_DIR/cmd/ipfs/ipfs /target/ipfs
EOF

FROM node:lts-bookworm AS runtime
ARG TARGETPLATFORM
RUN npm i -g npm@latest

ARG LOGLEVEL
ENV NPM_CONFIG_LOGLEVEL=${LOGLEVEL}

COPY --from=ipfs_build /target /usr/local/bin

WORKDIR /sqnc-ipfs

# Install base dependencies
COPY . .
RUN npm ci --production

ENV IPFS_PATH=/ipfs

# Expose 80 for healthcheck
EXPOSE 80
# Expose 4001 for ipfs swarm
EXPOSE 4001
# expose 5001 for ipfs api
EXPOSE 5001

HEALTHCHECK CMD curl --fail http://localhost:80/health || exit 1

ENTRYPOINT [ "./app/index.js" ]
