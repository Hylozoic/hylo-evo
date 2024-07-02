import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getCurrentlyRelatedGroupIds } from 'store/selectors/getGroupRelationships'
import getMyHostedGroups from 'store/selectors/getMyHostedGroups'
import getRouteParam from 'store/selectors/getRouteParam'

export const getPossibleRelatedGroups = ormCreateSelector(
  orm,
  getGroupForCurrentRoute,
  (session, props) => getCurrentlyRelatedGroupIds(session, { groupSlug: getRouteParam('groupSlug', session, props) }),
  getMyHostedGroups,
  (session, group, currentRelationships, hostedGroups) => {
    // TODO: check for cycles, cant add a grandparent as a child
    return hostedGroups.filter(mg => {
      return mg.id !== group.id && !currentRelationships.includes(mg.id)
    }).sort((a, b) => a.name.localeCompare(b.name))
  }
)
