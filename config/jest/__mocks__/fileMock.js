import { http, Response } from 'msw'

module.exports = 'test-file-stub'

export const handlers = [
  http.get('http://localhost/socket.io/', () => {
    console.log('http://localhost/socket.io/ called, ignoring')
    console.trace()
    return new Response('no hylo-node server in mocked tests')
  })
]
