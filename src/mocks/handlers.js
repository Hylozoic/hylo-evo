import { rest } from 'msw'

export const handlers = [
  rest.get('http://localhost/socket.io/', (req, res, ctx) => {
    console.log('http://localhost/socket.io/ called in mocked test')
    console.trace()
    return res(
      ctx.status(200),
      ctx.json({})
    )
  })
]
