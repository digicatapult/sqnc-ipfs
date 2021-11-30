const { createNodeApi } = require('../../../app/keyWatcher/api')

const getSwarmKey = async () => {
  const api = await createNodeApi()
  const key = await api.getCurrentKey()
  return key
}

module.exports = {
  getSwarmKey,
}
