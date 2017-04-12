import orm from 'store/models'
import { createSelector } from 'reselect'
import getParam from './getParam'

const getCommunityForCurrentRoute = createSelector(
  state => orm.session(state.orm),
  getParam('slug'),
  (session, slug) => {
    try {
      return session.Community.get({slug})
    } catch (e) {
      return null
    }
  }
)

export default getCommunityForCurrentRoute
