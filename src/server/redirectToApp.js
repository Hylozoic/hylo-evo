import checkLogin from '../store/actions/checkLogin'
import createStore from '../store'
import { createMemoryHistory } from 'history'

export default function (req, res, next, opts = {}) {
  if (req.url !== '/' || !req.cookies[process.env.HYLO_COOKIE_NAME]) {
    return next()
  }

  const store = opts.mockStore || createStore(createMemoryHistory(), req)

  return store.dispatch(checkLogin())
    .then(({ payload }) => {
      if (payload?.data?.me?.id) {
        return res.redirect('/app?rd=1')
      }
      next()
    })
    .catch(() => next())
}
