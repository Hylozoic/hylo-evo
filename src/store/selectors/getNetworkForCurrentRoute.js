import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getParam from './getParam'
import { getNetworkSlugInPath } from 'util/index'

export function getNetworkSlugFromLocation (state, props) {
  const result = getParam('networkSlug', state, props, false) ||
    tryLocation(props) ||
    props.networkSlug
  return result
}

// this is a workaround for fetching the slug from the current path when you are
// in a component, like PrimaryLayout, that isn't matching a route where the
// slug is a parameter
function tryLocation (props) {
  if (!props.location) return null
  return getNetworkSlugInPath(props.location.pathname)
}

const getNetworkForCurrentRoute = ormCreateSelector(
  orm,
  state => state.orm,
  getNetworkSlugFromLocation,
  (session, slug) => {
    return session.Network.safeGet({slug})
  }
)

export default getNetworkForCurrentRoute
