import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'

import env from '../env.js'

export const createNodeApi = async () => {
  const provider = new WsProvider(`ws://${env.NODE_HOST}:${env.NODE_PORT}`)
  const api = new ApiPromise({ provider })

  api.isReadyOrError.catch(() => {}) // prevent unhandled promise rejection errors

  await api.isReady

  return {
    _api: api,
    _keyring: new Keyring({ type: 'sr25519' }),
    isEventKeyUpdate: (event) => api.events.ipfsKey.UpdateKey.is(event),
    getCurrentKey: async () => await api.query.ipfsKey.key(),
    setupEventProcessor: (eventProcessor) => api.query.system.events(eventProcessor),
  }
}
