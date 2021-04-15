import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { logout } from 'routes/NonAuthLayout/Login/Login.store'
import { toggleDrawer, toggleGroupMenu } from 'routes/PrimaryLayout/PrimaryLayout.store'

export function mapStateToProps (state, props) {
  const isPublic = props.routeParams.context === 'public'

  return {
    isPublic,
    isGroupMenuOpen: get('PrimaryLayout.isGroupMenuOpen', state)
  }
}

export default connect(mapStateToProps, { logout, toggleDrawer, toggleGroupMenu })
