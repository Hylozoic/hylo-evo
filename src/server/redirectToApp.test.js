import { graphql } from 'msw'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import redirectToApp, { HYLO_COOKIE_NAME } from './redirectToApp'

it('just calls next() if the url is not /', () => {
  const req = {
    url: '/foo',
    cookies: { [HYLO_COOKIE_NAME]: 'yeah' }
  }
  const res = { redirect: jest.fn() }
  const next = jest.fn()

  redirectToApp(req, res, next)

  expect(next).toBeCalled()
  expect(res.redirect).not.toBeCalled()
})

it('just calls next() if there is no matching cookie', () => {
  const req = {
    url: '/',
    cookies: {}
  }
  const res = { redirect: jest.fn() }
  const next = jest.fn()

  redirectToApp(req, res, next)

  expect(next).toBeCalled()
  expect(res.redirect).not.toBeCalled()
})

it('just calls next() if user is not logged in', async () => {
  const req = {
    url: '/',
    cookies: { [HYLO_COOKIE_NAME]: 'yeah' },
    headers: { cookie: 'yeah' }
  }
  const res = { redirect: jest.fn() }
  const next = jest.fn()

  mockGraphqlServer.resetHandlers(
    graphql.query('CheckLogin', (req, res, ctx) => {
      return res(
        ctx.data({
          checkLogin: {
            me: null
          }
        })
      )
    })
  )

  await redirectToApp(req, res, next)

  expect(next).toBeCalled()
  expect(res.redirect).not.toBeCalled()
})

it('redirects to /app when user is logged in', async () => {
  const reqWithTrailingSlash = {
    url: '',
    cookies: { [HYLO_COOKIE_NAME]: 'yeah' },
    headers: { cookie: 'yeah' }
  }
  const reqWithoutTrailingSlash = {
    url: '',
    cookies: { [HYLO_COOKIE_NAME]: 'yeah' },
    headers: { cookie: 'yeah' }
  }
  const res = { redirect: jest.fn() }
  const next = jest.fn()

  mockGraphqlServer.resetHandlers(
    graphql.query('CheckLogin', (req, res, ctx) => {
      return res(
        ctx.data({
          checkLogin: {
            me: {
              id: '1'
            }
          }
        })
      )
    })
  )

  await redirectToApp(reqWithoutTrailingSlash, res, next)

  expect(next).not.toBeCalled()
  expect(res.redirect).toBeCalledWith('/app?rd=1')

  await redirectToApp(reqWithTrailingSlash, res, next)

  expect(next).not.toBeCalled()
  expect(res.redirect).toBeCalledWith('/app?rd=1')
})
