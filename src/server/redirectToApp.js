import checkLogin from '../store/actions/checkLogin'
import store from '../store'
import { createMemoryHistory } from 'history'

export default function (req, res, next, opts = {}) {
  if (req.url !== '/' || !req.cookies[procimport.meta.env.VITE_HYLO_COOKIE_NAME]) {
    return next()
  }

  // TODO: how to pass in different history with react router 6?
  // const store = opts.mockStore || createStore(createMemoryHistory(), req)

  return store.dispatch(checkLogin())
    .then(({ payload }) => {
      if (payload?.data?.me?.id) {
        return res.redirect('/app?rd=1')
      }
      next()
    })
    .catch(() => next())
}
