const fs = require('fs/promises')

const { IPFS_CONFIG_PATH } = require('../env')
const logger = require('../logger')

async function readIpfsConfig() {
  let config = {}
  // read and parse config file
  try {
    const raw = await fs.readFile(IPFS_CONFIG_PATH, { encoding: 'utf8' })
    config = JSON.parse(raw)
  } catch (error) {
    logger.error('IPFS config not found or invalid. Error was: %s', error.message)
    throw new Error('IPFS config not found or invalid')
  }
  return config
}

module.exports = {
  readIpfsConfig,
}
