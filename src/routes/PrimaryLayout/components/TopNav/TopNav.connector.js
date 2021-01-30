import { connect } from 'react-redux'
import { logout } from 'routes/NonAuthLayout/Login/Login.store'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'

export function mapStateToProps (state, props) {
  const { currentLocation } = state.locationHistory
  let isPublic = false
  if (currentLocation.includes('/public')) {
    isPublic = true
  }

  return {
    isPublic
  }
}

export default connect(mapStateToProps, { logout, toggleDrawer })
