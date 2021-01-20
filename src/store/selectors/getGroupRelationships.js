import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'

export const getChildGroups = ormCreateSelector(
  orm,
  getGroupForCurrentRoute,
  (session, group) => {
    return group.childGroups.toModelArray()
  }
)

export const getParentGroups = ormCreateSelector(
  orm,
  getGroupForCurrentRoute,
  (session, group) => {
    return group.parentGroups.toModelArray()
  }
)
