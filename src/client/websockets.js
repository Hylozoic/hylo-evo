const environment = process.env.NODE_ENV || 'development'
const socketHost = process.env.SOCKET_HOST
const isClient = typeof window !== 'undefined' && !window.isMock

let socket // client-side singleton

if (isClient) {
  const socketIOClient = require('socket.io-client')
  const sailsIOClient = require('sails.io.js')
  const io = sailsIOClient(socketIOClient)
  io.sails.url = socketHost
  io.sails.environment = environment
  io.sails.reconnection = true
  socket = io.socket
} else {
  const noop = () => {}
  socket = {get: noop, post: noop, on: noop, off: noop}
}

export const socketUrl = path => `${socketHost}/${path.replace(/^\//, '')}`

export const getSocket = () => socket
