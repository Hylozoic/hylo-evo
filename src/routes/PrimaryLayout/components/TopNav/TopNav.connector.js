import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { logout } from 'routes/NonAuthLayout/Login/Login.store'
import { toggleDrawer, toggleGroupMenu } from 'routes/PrimaryLayout/PrimaryLayout.store'

export function mapStateToProps (state, props) {
  const { currentLocation } = state.locationHistory
  let isPublic = false
  if (currentLocation.includes('/public')) {
    isPublic = true
  }

  return {
    isPublic,
    isGroupMenuOpen: get('PrimaryLayout.isGroupMenuOpen', state)
  }
}

export default connect(mapStateToProps, { logout, toggleDrawer, toggleGroupMenu })
