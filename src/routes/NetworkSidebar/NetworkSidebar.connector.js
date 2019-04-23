import { connect } from 'react-redux'

import getMe from 'store/selectors/getMe'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'

export function mapStateToProps (state, props) {
  const me = getMe(state)
  const network = getNetworkForCurrentRoute(state, props)

  return {
    network: network ? network.ref : null,
    isModerator: network && !!network.isModerator,
    isAdmin: me ? me.isAdmin : false
  }
}

export default connect(mapStateToProps)
