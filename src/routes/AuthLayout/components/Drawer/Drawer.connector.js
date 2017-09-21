import { connect } from 'react-redux'
import { toggleDrawer } from 'routes/AuthLayout/AuthLayout.store'
import getMembershipsForDrawer from './Drawer.store'
import { push } from 'react-router-redux'

function buildNetworkLookup (networks, { id, community, newPostCount, network }) {
  if (!network) return networks
  if (!networks[network.name]) networks[network.name] = { ...network, memberships: [] }
  networks[network.name].memberships.push({ id, community, newPostCount })
  return networks
}

export function mapStateToProps (state, props) {
  const memberships = getMembershipsForDrawer(state)
  let networks = memberships.reduce(buildNetworkLookup, {})
  networks = Object.keys(networks).sort().map(network => networks[network])
  return {
    memberships,
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
