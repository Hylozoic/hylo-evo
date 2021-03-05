import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import { ALL_GROUPS_ID, ALL_GROUPS_AVATAR_PATH, PUBLIC_CONTEXT_ID, PUBLIC_CONTEXT_AVATAR_PATH } from 'store/models/Group'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getMe from 'store/selectors/getMe'
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
  getMyMemberships,
  (memberships) => memberships.map(m => ({ ...m.group.ref, newPostCount: m.newPostCount })).sort((a, b) => a.name.localeCompare(b.name))
)

export function mapStateToProps (state, props) {
  const { currentLocation } = state.locationHistory
  const groups = getGroups(state)
  const canModerate = props.group && getMe(state, props).canModerate(props.group)

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
