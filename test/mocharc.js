module.exports = {
  recursive: true,
  slow: 30000,
  timeout: 60000,
  extension: ['.test.js'],
  require: ['./test/integration/fixtures.js'],
  exit: true,
}
