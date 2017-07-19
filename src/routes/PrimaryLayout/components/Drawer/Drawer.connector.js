import { connect } from 'react-redux'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import getMemberships from 'store/selectors/getMemberships'

function buildNetworkLookup (networks, { id, community, newPostCount, network }) {
  if (!network) return networks
  if (!networks[network.name]) networks[network.name] = { ...network, memberships: [] }
  networks[network.name].memberships.push({ id, community, newPostCount })
  return networks
}

export function mapStateToProps (state, props) {
  const memberships = getMemberships(state)
  let networks = memberships.reduce(buildNetworkLookup, {})
  networks = Object.keys(networks).sort().map(network => networks[network])
  return {
    memberships,
    networks
  }
}

export const mapDispatchToProps = {
  toggleDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)
