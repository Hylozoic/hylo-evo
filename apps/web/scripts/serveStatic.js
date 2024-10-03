const server = require('pushstate-server')
server.start({ port: process.env.PORT, directory: './build' })
