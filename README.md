# sqnc-ipfs

Manages a [kubo](https://docs.ipfs.tech/install/command-line/) instance maintaining the private network swarm key based on the value from a `sqnc-node` instance.

## Local development

> install dependencies

```sh
npm i
```

> start substrate node

```sh
docker compose up -d // -d for silent
```

(if you are getting errors like:

```sh
5:20:59 ⚠️  SQNC_IPFS IPFS: Error: no IPFS repo found in /Users/hadamkova/eng/sqnc/sqnc-ipfs/data.
15:20:59 ⚠️  SQNC_IPFS IPFS: please run: 'ipfs init'
15:20:59 ⚠️  SQNC_IPFS IPFS:
15:20:59 🚨 SQNC_IPFS IPFS process unexpectedly exited with code 1

```

run:

```sh
mkdir data && cd data/
# export it's path
export IPFS_PATH=$PWD
# then init ipfs
../node_modules/kubo/bin/ipfs init
# set config
../node_modules/kubo/bin/ipfs config --json AutoConf.Enabled false
../node_modules/kubo/bin/ipfs config --json Bootstrap '[]'
# then cd back to root and continue
```

)

> start ipfs nodejs wrapper

```sh
npm run dev
```

## To run with telemetry

```sh
npm i
# start dependencies with
docker-compose -f ./docker-compose.yml -f ./docker-compose.telemetry.yml up -d
# run with telemetry
npm run dev:telemetry
```

## Environment Variables

`sqnc-ipfs` is configured primarily using environment variables as follows:

| variable        | required |   default    | description                                                                          |
| :-------------- | :------: | :----------: | :----------------------------------------------------------------------------------- |
| SERVICE_TYPE    |    N     | `sqnc-ipfs`  | Service type to appear in logs                                                       |
| PORT            |    N     |     `80`     | The port for the API to listen on                                                    |
| LOG_LEVEL       |    N     |    `info`    | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`] |
| NODE_HOST       |    Y     |              | Hostname of the `sqnc-node` to use as the swarm key source                           |
| NODE_PORT       |    N     |    `9943`    | Websocket port of the `sqnc-node` to use as the swarm key source                     |
| IPFS_PATH       |    N     |   `/ipfs`    | IPFS data storage path                                                               |
| IPFS_EXECUTABLE |    N     |    `ipfs`    | Executable to use to run go-ipfs                                                     |
| IPFS_ARGS       |    N     | `["daemon"]` | JSON array of strings to pass as arguments to the `IPFS_EXECUTABLE`                  |
| IPFS_LOG_LEVEL  |    N     |    `info`    | Log level of the go-ipfs child process                                               |

## Docker build

`sqnc-ipfs` can be built into a docker container. There is a required build argument for this `IPFS_TAG` which specifies what version of `kubo` should be built into `sqnc-ipfs`. The container can therefore be built using:

```sh
docker build --build-arg IPFS_TAG="v0.31.0" .
```
