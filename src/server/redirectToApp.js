import { checkLogin } from 'routes/NonAuthLayout/Login/Login.store'
import createStore from '../store'
import createHistory from 'history/createMemoryHistory'

// this is defined in hylo-node:config/session.js
export const HYLO_COOKIE_NAME = 'hylo.sid.1'

export default function (req, res, next, opts = {}) {
  if (req.url !== '/' || !req.cookies[HYLO_COOKIE_NAME]) {
    return next()
  }

  const store = opts.mockStore || createStore(createHistory(), req)

  return store.dispatch(checkLogin())
  .then(({ payload }) => {
    if (payload && payload.signedIn) {
      return res.redirect('/app?rd=1')
    }
    next()
  })
  .catch(err => next()) // eslint-disable-line handle-callback-err
}
