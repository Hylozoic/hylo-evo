import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get } from 'lodash/fp'

const getCanModerate = ormCreateSelector(
  orm,
  (state, props) => props.group,
  ({ Me, Membership }, group) => {
    const me = Me.first()
    if (group && me) {
      const membership = Membership.safeGet({ group: group.id, person: me.id })
      return get('hasModeratorRole', membership)
    } else {
      return false
    }
  }
)

export default getCanModerate
