import redirectToApp, { HYLO_COOKIE_NAME } from './redirectToApp'
import { CHECK_LOGIN } from 'store/constants'

var res, next

const makeStore = signedIn => ({
  dispatch: jest.fn(action => {
    if (action.type === CHECK_LOGIN) {
      action = { ...action, payload: { signedIn } }
    }

    return Promise.resolve(action)
  })
})

beforeEach(() => {
  res = { redirect: jest.fn() }
  next = jest.fn()
})

it('just calls next() if the url is not /', () => {
  const req = {
    url: '/foo',
    cookies: { [HYLO_COOKIE_NAME]: 'yeah' }
  }
  redirectToApp(req, res, next)
  expect(next).toBeCalled()
  expect(res.redirect).not.toBeCalled()
})

it('just calls next() if there is no matching cookie', () => {
  const req = {
    url: '/',
    cookies: {}
  }
  redirectToApp(req, res, next)
  expect(next).toBeCalled()
  expect(res.redirect).not.toBeCalled()
})

it('just calls next() if user is not logged in', () => {
  const req = {
    url: '/',
    cookies: { [HYLO_COOKIE_NAME]: 'yeah' },
    headers: { cookie: 'yeah' }
  }

  return redirectToApp(req, res, next, { mockStore: makeStore(false) })
    .then(() => {
      expect(next).toBeCalled()
      expect(res.redirect).not.toBeCalled()
    })
})

it('redirects to /app when user is logged in', () => {
  const req = {
    url: '/',
    cookies: { [HYLO_COOKIE_NAME]: 'yeah' },
    headers: { cookie: 'yeah' }
  }

  return redirectToApp(req, res, next, { mockStore: makeStore(true) })
    .then(() => {
      expect(next).not.toBeCalled()
      expect(res.redirect).toBeCalledWith('/app?rd=1')
    })
})
