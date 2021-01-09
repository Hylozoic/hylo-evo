import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { find, get } from 'lodash/fp'

const getCanModerate = ormCreateSelector(
  orm,
  (state, props) => props.group,
  ({ Me }, group) => {
    const me = Me.first()
    const memberships = me.memberships.toRefArray()
    const membership = find(m =>
      m.group === get('id', group), memberships)
    return get('hasModeratorRole', membership)
  }
)

export default getCanModerate
