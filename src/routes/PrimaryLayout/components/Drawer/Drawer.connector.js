import { connect } from 'react-redux'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import getMemberships from 'store/selectors/getMemberships'
import { push } from 'connected-react-router'
import { get, values, omit, each } from 'lodash/fp'
import { pullAllBy } from 'lodash'
import { ALL_GROUPS_ID, ALL_GROUPS_AVATAR_PATH, PUBLIC_CONTEXT_ID, PUBLIC_CONTEXT_AVATAR_PATH } from 'store/models/Group'
import getMe from 'store/selectors/getMe'
import { createSelector } from 'reselect'

const defaultNetworks = [
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

export function partitionGroups (memberships) {
  const allGroups = memberships.map(m => ({
    ...m.group.ref,
    // TODO: fix up to work with child groups
    network: m.group.network && {
      ...get('network.ref', m.group),
      groups: get('network.groups', m.group).toRefArray()
    },
    newPostCount: m.newPostCount
  }))

  const reduced = allGroups.reduce((acc, group) => {
    if (group.network) {
      if (acc[group.network.id]) {
        acc[group.network.id].groups = acc[group.network.id].groups.concat([group])
        return acc
      } else {
        acc[group.network.id] = {
          ...group.network,
          groups: [group],
          nonMemberGroups: group.network.groups
        }
        return acc
      }
    } else {
      acc['independent'] = acc['independent'].concat([group])
      return acc
    }
  }, {
    independent: []
  })

  const networks = values(omit('independent', reduced))

  // pulls out the groups that are already a member of from the nonMemberGroups array
  each(n => {
    pullAllBy(n.nonMemberGroups, n.groups, 'id')
  })(networks)

  return {
    networks,
    groups: reduced.independent
  }
}

const getPartitionGroups = createSelector(
  getMemberships,
  (memberships) => partitionGroups(memberships)
)

export function mapStateToProps (state, props) {
  const { currentLocation } = state.locationHistory
  const { networks, groups } = getPartitionGroups(state)
  const canModerate = props.group && getMe(state, props).canModerate(props.group)

  return {
    currentLocation,
    networks,
    defaultNetworks,
    groups,
    canModerate
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    toggleDrawer: () => dispatch(toggleDrawer()),
    goToCreateGroup: () => dispatch(push('/create-group/name'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
