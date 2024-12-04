# syntax=docker/dockerfile:1.12

FROM golang:1.23-alpine3.19 AS ipfs_build

ENV SRC_DIR=/go/src/github.com/ipfs/kubo
ARG TARGETPLATFORM
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then apk add --no-cache binutils-gold; fi

RUN apk add --no-cache git make bash gcc musl-dev

WORKDIR /target

ARG IPFS_TAG=NO_VALUE
RUN [ ! "${IPFS_TAG}" == "NO_VALUE" ]

RUN echo $IPFS_TAG

RUN <<EOF
set -ex
git clone --branch "$IPFS_TAG" https://github.com/ipfs/kubo.git $SRC_DIR
cd $SRC_DIR
make build
cp $SRC_DIR/cmd/ipfs/ipfs /target/ipfs
rm -rf $SRC_DIR
EOF

FROM node:lts-alpine3.19 AS runtime
ARG TARGETPLATFORM
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then apk add --no-cache python3 make g++; fi
RUN apk add --no-cache curl
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
