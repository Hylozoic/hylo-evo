import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { FETCH_MODERATION_ACTIONS } from 'store/constants'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const getModerationActionResults = makeGetQueryResults(FETCH_MODERATION_ACTIONS)

export const getModerationActions = ormCreateSelector(
  orm,
  (state, props) => props.groupId,
  (session, groupId) => {
    const moderationActions = session.ModerationAction.all().toModelArray()
    return groupId ? moderationActions.filter(ma => {
      console.log('ma.groupId', ma.groupId, 'akakaka', ma, moderationActions)
      return ma.groupId === groupId
    }) : moderationActions || []
  }
)

export const getHasMoreModerationActions = createSelector(getModerationActionResults, get('hasMore'))
export const getTotalModerationActions = createSelector(getModerationActionResults, get('total'))
