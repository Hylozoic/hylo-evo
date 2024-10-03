import curry from 'lodash/curry'
import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'

const environment = import.meta.env.PROD || 'development'
const socketHost = import.meta.env.SOCKET_HOST
const isClient = typeof window !== 'undefined' && !window.isMock

let socket // client-side singleton

if (isClient) {
  // const socketIOClient = require('socket.io-client')
  // const sailsIOClient = require('sails.io.js')
  // const io = sailsIOClient(socketIOClient)
  const io = sailsIOClient(socketIOClient)

  // Configure the connection URL
  io.sails.url = socketHost

  // Optional: configure additional options
  io.sails.autoConnect = true
  io.sails.useCORSRouteToGetCookie = false

  io.sails.environment = environment
  io.sails.reconnection = true
  socket = io.socket
} else {
  const noop = () => {}
  socket = { get: noop, post: noop, on: noop, off: noop }
}

export const socketUrl = path => `${socketHost}/${path.replace(/^\//, '')}`

export const getSocket = () => socket

// for testing
export const setSocket = mock => { socket = mock }

export const sendIsTyping = curry((postId, isTyping) => {
  const url = socketUrl(`/noo/post/${postId}/typing`)
  getSocket().post(url, { isTyping })
})
