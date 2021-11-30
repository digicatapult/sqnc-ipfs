const os = require('os')
const path = require('path')
const delay = require('delay')

const fs = require('fs/promises')

exports.mochaGlobalSetup = async function () {
  const ipfsDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vitalam-ipfs-'))
  process.env.IPFS_PATH = ipfsDir

  const { startServer, stopServer } = require('./helper/server')
  this.stopServer = stopServer

  await startServer(this)
  await delay(5000)
}

exports.mochaGlobalTeardown = async function () {
  await this.stopServer(this)
}
