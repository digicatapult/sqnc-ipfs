const { spawn } = require('child_process')
const fs = require('fs/promises')
const { IPFS_PATH, IPFS_EXECUTABLE, IPFS_ARGS, IPFS_LOG_LEVEL } = require('./env')
const logger = require('./logger')

const { createSwarmKeyFile, removeSwarmKeyFile } = require('./swarmKey')

async function assertIpfsPath() {
  // check for presence of IPFS_PATH
  try {
    await fs.access(IPFS_PATH)
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.warn('IPFS_PATH %s does not exist. Will be created')
      await fs.mkdir(IPFS_PATH)
    } else {
      throw err
    }
  }
}

async function setupIpfs() {
  let ipfs = null
  let ipfsLogger = logger.child({ module: 'ipfs' }, { level: IPFS_LOG_LEVEL })

  return {
    start: async ({ swarmKey }) => {
      if (ipfs) {
        throw new Error('Cannot start an IPFS node that is already running')
      }

      await createSwarmKeyFile({ swarmKey })

      logger.info('Swarm key written, starting IPFS')

      ipfs = spawn(IPFS_EXECUTABLE, IPFS_ARGS, {
        env: {
          ...process.env,
          LIBP2PFORCEPNET: 1,
          IPFS_PATH,
        },
      })

      ipfs.stdout.on('data', (data) => {
        const dataString = `${data}`
        for (const line of dataString.split('\n')) {
          ipfsLogger.debug('IPFS: %s', line)
        }
      })

      ipfs.stderr.on('data', (data) => {
        ipfsLogger.error(`%j`, data)
      })

      ipfs.stderr.on('data', (err) => {
        ipfsLogger.error('%j', err)
      })

      ipfs.on('close', (code) => {
        ipfsLogger.info('IPFS process exited with code %s', code)
        ipfs = null
      })
    },
    stop: async () => {
      logger.info('Stopping IPFS')

      try {
        await new Promise((resolve, reject) => {
          if (ipfs) {
            ipfs.on('close', () => {
              resolve()
            })
            ipfs.on('error', (err) => {
              reject(err)
            })
            ipfs.kill()
          } else {
            resolve()
          }
        })
      } catch (err) {
        logger.error('Error closing IPFS. Error was $s', err.message || err)
      }
      await removeSwarmKeyFile()
    },
  }
}

module.exports = {
  assertIpfsPath,
  setupIpfs,
}
