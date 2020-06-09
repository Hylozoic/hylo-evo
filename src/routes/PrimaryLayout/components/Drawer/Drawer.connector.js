import { connect } from 'react-redux'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import getMemberships from 'store/selectors/getMemberships'
import { push } from 'connected-react-router'
import { get, values, omit, each } from 'lodash/fp'
import { pullAllBy } from 'lodash'
import { ALL_COMMUNITIES_ID, ALL_COMMUNITIES_AVATAR_PATH, PUBLIC_COMMUNITIES_ID, PUBLIC_COMMUNITIES_AVATAR_PATH } from 'store/models/Community'
import getMe from 'store/selectors/getMe'
import { createSelector } from 'reselect'

export function partitionCommunities (memberships) {
  const allCommunities = memberships.map(m => ({
    ...m.community.ref,
    network: m.community.network && {
      ...get('network.ref', m.community),
      communities: get('network.communities', m.community).toRefArray()
    },
    newPostCount: m.newPostCount
  }))

  const reduced = allCommunities.reduce((acc, community) => {
    if (community.network) {
      if (acc[community.network.id]) {
        acc[community.network.id].communities = acc[community.network.id].communities.concat([community])
        return acc
      } else {
        acc[community.network.id] = {
          ...community.network,
          communities: [community],
          nonMemberCommunities: community.network.communities
        }
        return acc
      }
    } else {
      acc['independent'] = acc['independent'].concat([community])
      return acc
    }
  }, {
    independent: []
  })

  const networks = [].concat(values(omit('independent', reduced)))

  // pulls out the communities that are already a member of from the nonMemberCommunities array
  each(n => {
    pullAllBy(n.nonMemberCommunities, n.communities, 'id')
  })(networks)

  return {
    networks,
    communities: reduced.independent
  }
}

const getPartitionCommunities = createSelector(
  getMemberships,
  (memberships) => partitionCommunities(memberships)
)

export function mapStateToProps (state, props) {
  const { currentLocation } = state.locationHistory
  const { networks, communities } = getPartitionCommunities(state)
  const canModerate = props.community && getMe(state, props).canModerate(props.community)
  const defaultNetworks = [
    {
      id: PUBLIC_COMMUNITIES_ID,
      name: 'Public Communities & Posts',
      communities: [],
      path: '/public',
      avatarUrl: PUBLIC_COMMUNITIES_AVATAR_PATH
    },
    {
      id: ALL_COMMUNITIES_ID,
      name: 'All Communities',
      communities: [],
      path: '/all',
      avatarUrl: ALL_COMMUNITIES_AVATAR_PATH
    }
  ]

  return {
    currentLocation,
    networks,
    defaultNetworks,
    communities,
    canModerate
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    toggleDrawer: () => dispatch(toggleDrawer()),
    goToCreateCommunity: () => dispatch(push('/create-community/name'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
