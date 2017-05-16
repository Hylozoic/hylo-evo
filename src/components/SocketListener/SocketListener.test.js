import SocketListener, { handledEvents } from './SocketListener'
import { mount } from 'enzyme'
import React from 'react'
import { getSocket, setSocket } from 'client/websockets'

var realSocket, mockSocket, listens

beforeEach(() => {
  realSocket = getSocket()
  listens = []
  mockSocket = {
    post: jest.fn(),
    listens: [],
    on: jest.fn(function () {
      listens.push(Array.prototype.slice.call(arguments))
    })
  }
  setSocket(mockSocket)
})

afterEach(() => {
  setSocket(realSocket)
})

it('sets up event handlers and subscribes', () => {
  mount(<SocketListener />)

  handledEvents.forEach(name => {
    const listen = listens.find(x => x[0] === name)
    expect(listen).toBeTruthy()
    expect(typeof listen[1]).toEqual('function')
  })

  expect(mockSocket.post)
  .toHaveBeenCalledWith(`${process.env.SOCKET_HOST}/noo/threads/subscribe`)
})
