const os = require('os')
const path = require('path')
const fs = require('fs/promises')

const { before, after } = require('mocha')
const IPFS = require('ipfs-core')
const Protector = require('libp2p/src/pnet')

const config = require('../../config/node-2.json')

const setupIPFS = async (context) => {
  const ipfsDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vitalam-ipfs-'))
  before(async function () {
    context.ipfs = await IPFS.create({
      start: true,
      config,
      repo: ipfsDir,
      silent: true,
      libp2p: {
        modules: {
          connProtector: context.swarmKey
            ? new Protector(
                Buffer.from(['/key/swarm/psk/1.0.0/', '/base16/', context.swarmKey.toString('hex')].join('\n'), 'utf8')
              )
            : undefined,
        },
      },
    })
  })

  after(async function () {
    await context.ipfs.stop()
  })
}

module.exports = {
  setupIPFS,
}
