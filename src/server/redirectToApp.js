import { checkLogin } from '../store/actions/checkLogin'
import createStore from '../store'
import { createMemoryHistory } from 'history'

// this is defined in hylo-node:config/session.js
export const HYLO_COOKIE_NAME = 'hylo.sid.1'

export default function (req, res, next, opts = {}) {
  if (req.url !== '/' || !req.cookies[HYLO_COOKIE_NAME]) {
    return next()
  }

  const store = opts.mockStore || createStore(createMemoryHistory(), req)

  return store.dispatch(checkLogin())
    .then(({ payload }) => {
      if (payload && payload.signedIn) {
        return res.redirect('/app?rd=1')
      }
      next()
    })
    .catch(err => next()) // eslint-disable-line handle-callback-err
}
