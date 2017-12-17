import appMiddleware from './appMiddleware'

var req, res

beforeEach(() => {
  req = {
    url: '/login'
  }

  res = {
    status: () => res,
    send: jest.fn(output => { res.body = output })
  }

  appMiddleware.getIndexFile = () => '<html><div id="root"></div></html>'
})

it('renders the app', () => {
  appMiddleware(req, res)
  expect(res.body).toMatchSnapshot()
})
