var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  accesskey: JSON.stringify(process.env.accesskey),
  secretkey: JSON.stringify(process.env.secretkey),
  domainkey: JSON.stringify(process.env.domainkey),
  server_port:  JSON.stringify(process.env.server_port),
  socket_port: JSON.stringify(process.env.socket_port),
})
