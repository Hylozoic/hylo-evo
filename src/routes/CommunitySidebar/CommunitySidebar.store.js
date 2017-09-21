import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { find, get } from 'lodash/fp'

export const getCanModerate = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.community,
  ({ Me }, community) => {
    const me = Me.first()
    const memberships = me.memberships.toRefArray()
    const membership = find(m =>
      m.community === get('id', community), memberships)
    return get('hasModeratorRole', membership)
  }
)
