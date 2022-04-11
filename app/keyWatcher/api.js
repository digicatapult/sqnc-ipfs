const { ApiPromise, WsProvider } = require('@polkadot/api')
const types = require('@digicatapult/dscp-node')
const { NODE_HOST, NODE_PORT } = require('../env')

const provider = new WsProvider(`ws://${NODE_HOST}:${NODE_PORT}`)
const apiOptions = {
  provider,
  types,
}

const createNodeApi = async () => {
  const api = await ApiPromise.create(apiOptions)
  return {
    _api: api,
    isEventKeyUpdate: (event) => api.events.ipfsKey.UpdateKey.is(event),
    getCurrentKey: async () => await api.query.ipfsKey.key(),
    setupEventProcessor: (eventProcessor) => api.query.system.events(eventProcessor),
  }
}

module.exports = { createNodeApi }
