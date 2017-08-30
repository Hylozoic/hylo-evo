import { configureStore } from '../store'
import { fetchCurrentUser } from '../actions'

// this is defined in hylo-node:config/session.js
const HYLO_COOKIE_NAME = 'hylo.sid.1'

export default function (req, res, next) {
  if (req.url !== '/' || !req.cookies[HYLO_COOKIE_NAME]) return next()

  const { store } = configureStore({}, {request: req})
  store.dispatch(fetchCurrentUser())
  .then(({ error, payload }) => {
    if (!error && payload && payload.id) return res.redirect('/app?rd=1')
    next()
  })
  .catch(err => next()) // eslint-disable-line handle-callback-err
}
