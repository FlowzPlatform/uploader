var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  MYENV: '"development"',
  accesskey: JSON.stringify(process.env.accesskey),
  secretkey: JSON.stringify(process.env.secretkey),
  domainkey: JSON.stringify(process.env.domainkey),
  server_port:  JSON.stringify(process.env.server_port),
  socket_port: JSON.stringify(process.env.socket_port),
  is_ssl: JSON.stringify(process.env.is_ssl)
})
