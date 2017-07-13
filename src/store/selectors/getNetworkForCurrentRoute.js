import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getParam from './getParam'

const getNetworkForCurrentRoute = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => getParam('networkSlug', state, props, false),
  (session, slug) => session.Network.safeGet({slug})
)

export default getNetworkForCurrentRoute
