const fetch = require('node-fetch')
const FormData = require('form-data')

const { expect } = require('chai')

// initial delay before tests to ensure everything is healthy

// write a file to ipfs1
// read file from ipfs2

// write a file to ipfs2
// read file from ipfs1

// write file to ipfs1
// rotate swarm key
// read file from ipfs2

// read swarm key
// create an ipfs node
// write file to ipfs1
// read file from local

// read swarm key
// create an ipfs node
// write file to ipfs1
// rotate swarm key
// try read file from local (should fail)

const upload = async (contents) => {
  const form = new FormData()
  form.append('file', Buffer.from(contents, 'utf8'), 'test-file')
  const body = await fetch(`http://localhost:5001/api/v0/add?cid-version=0`, {
    method: 'POST',
    body: form,
  })

  return (await body.json()).Hash
}

describe('ipfs', function () {
  describe('read an uploaded file from same node', function () {
    const context = {}
    before(async function () {
      context.hash = await upload('Test 1')
    })

    it('should be retrievable', async function () {
      const contentBody = await fetch(`http://localhost:5001/api/v0/cat?arg=${context.hash}`, { method: 'POST' })
      const contentText = await contentBody.text()
      expect(contentText).to.equal('Test 1')
    })
  })
})
