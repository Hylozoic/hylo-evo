import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getParam from './getParam'
import { getSlugInPath } from 'util/index'

const getCommunityForCurrentRoute = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => getParam('slug', state, props) || tryLocation(props),
  (session, slug) => {
    try {
      return session.Community.get({slug})
    } catch (e) {
      return null
    }
  }
)

export default getCommunityForCurrentRoute

// this is a workaround for fetching the slug from the current path when you are
// in a component, like PrimaryLayout, that isn't matching a route where the
// slug is a parameter
function tryLocation (props) {
  if (!props.location) return null
  return getSlugInPath(props.location.pathname)
}
