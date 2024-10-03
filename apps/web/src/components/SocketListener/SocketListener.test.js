import SocketListener from './SocketListener'
import { mount } from 'enzyme'
import React from 'react'
import { getSocket, setSocket } from 'client/websockets.mjs'

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
  const wrapper = mount(<SocketListener
    receiveComment={() => {}}
    receiveMessage={() => {}}
    receiveNotification={() => {}}
    receivePost={() => {}}
    receiveThread={() => {}} />)
  const handlers = Object.keys(wrapper.instance().handlers)
  handlers.forEach(name => {
    const listen = listens.find(x => x[0] === name)
    expect(listen).toBeTruthy()
    expect(typeof listen[1]).toEqual('function')
  })

  expect(mockSocket.post).toBeCalled()
  expect(mockSocket.post.mock.calls[0][0])
    .toBe(`${process.env.SOCKET_HOST}/noo/threads/subscribe`)
})
