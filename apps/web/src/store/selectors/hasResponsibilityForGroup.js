import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'

const hasResponsibilityForGroup = ormCreateSelector(
  orm,
  (state, props) => props.responsibility,
  (state, props) => getResponsibilitiesForGroup(state, props),
  (state, responsibility, responsibilities) => {
    const checkResponsibilities = Array.isArray(responsibility) ? responsibility : [responsibility]
    return responsibilities.some(r => checkResponsibilities.includes(r.title))
  }
)

export default hasResponsibilityForGroup
