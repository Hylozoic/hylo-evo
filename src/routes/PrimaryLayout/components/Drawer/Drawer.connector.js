import { connect } from 'react-redux'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import getMemberships from 'store/selectors/getMemberships'
import { push } from 'react-router-redux'
import { get, values, omit } from 'lodash/fp'
import { ALL_COMMUNITIES_ID, ALL_COMMUNITIES_AVATAR_PATH } from 'store/models/Community'

export function partitionCommunities (memberships) {
  const allCommunities = memberships.map(m => ({
    ...m.community.ref,
    network: get('network.ref', m.community),
    newPostCount: m.newPostCount
  }))

  return allCommunities.reduce((acc, community) => {
    if (community.network) {
      if (acc[community.network.id]) {
        acc[community.network.id].communities = acc[community.network.id].communities.concat([community])
        return acc
      } else {
        acc[community.network.id] = {
          ...community.network,
          communities: [community]
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
}

export function mapStateToProps (state, props) {
  const paritionedCommunities = partitionCommunities(getMemberships(state))
  const networks = [
    {
      id: ALL_COMMUNITIES_ID,
      name: 'All Communities',
      communities: [],
      path: '/all',
      avatarUrl: ALL_COMMUNITIES_AVATAR_PATH
    }
  ].concat(values(omit('independent', paritionedCommunities)))

  const communities = paritionedCommunities.independent
  return {
    communities,
    networks
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    toggleDrawer: () => dispatch(toggleDrawer()),
    goToCreateCommunity: () => dispatch(push('/create-community/name'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
