import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { createSelector } from 'redux-orm'

import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import orm from 'store/models'
import { ALL_GROUPS_ID, ALL_GROUPS_AVATAR_PATH, PUBLIC_CONTEXT_ID, PUBLIC_CONTEXT_AVATAR_PATH } from 'store/models/Group'
import getCanModerate from 'store/selectors/getCanModerate'
import getMyMemberships from 'store/selectors/getMyMemberships'
import { createGroupUrl } from 'util/navigation'

const defaultContexts = [
  {
    id: PUBLIC_CONTEXT_ID,
    name: 'Public Groups & Posts',
    groups: [],
    context: 'public',
    avatarUrl: PUBLIC_CONTEXT_AVATAR_PATH
  },
  {
    id: ALL_GROUPS_ID,
    name: 'All My Groups',
    groups: [],
    context: 'all',
    avatarUrl: ALL_GROUPS_AVATAR_PATH
  }
]

const getGroups = createSelector(
  orm,
  getMyMemberships,
  (state, memberships) => memberships.map(m => ({ ...m.group.ref, newPostCount: m.newPostCount })).sort((a, b) => a.name.localeCompare(b.name))
)

export function mapStateToProps (state, props) {
  const { currentLocation } = state.locationHistory
  const groups = getGroups(state, props)
  const canModerate = props.group && getCanModerate(state, props)

  return {
    currentLocation,
    defaultContexts,
    groups,
    canModerate
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    toggleDrawer: () => dispatch(toggleDrawer()),
    goToCreateGroup: () => dispatch(push(createGroupUrl(get('match.params', props))))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
