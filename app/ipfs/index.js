const { readIpfsConfig } = require('./config')
const { setupIpfs } = require('./ipfs')

const setup = async () => {
  const config = await readIpfsConfig()
  return setupIpfs(config)
}

module.exports = {
  setupIpfs: setup,
}
