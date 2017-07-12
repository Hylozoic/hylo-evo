import { connect } from 'react-redux'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import getMemberships from 'store/selectors/getMemberships'

function buildNetworkLookup (networks, { community, network }) {
  if (!networks[network.name]) networks[network.name] = { ...network, communities: [] }
  networks[network.name].communities.push(community)
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
