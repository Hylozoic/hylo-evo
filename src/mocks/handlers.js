import { rest, http } from 'msw'

export const handlers = [
  rest.get('/socket.io', (req, res, ctx) => {
    console.log('http://localhost/socket.io/ called in mocked test')
    console.trace()
    return res(
      ctx.status(404),
      ctx.json({})
    )
  }),
  http.get('/socket.io', (req, res, ctx) => {
    console.log('http://localhost/socket.io/ called in mocked test')
    console.trace()
    return res(
      ctx.status(404),
      ctx.json({})
    )
  }),
  rest.get('/socket.io/', (req, res, ctx) => {
    console.log('http://localhost/socket.io/ called in mocked test')
    console.trace()
    return res(
      ctx.status(404),
      ctx.json({})
    )
  }),
  http.get('/socket.io/', (req, res, ctx) => {
    console.log('http://localhost/socket.io/ called in mocked test')
    console.trace()
    return res(
      ctx.status(404),
      ctx.json({})
    )
  })
]
