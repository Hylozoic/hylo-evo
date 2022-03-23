import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { push } from 'connected-react-router'
import logout from 'store/actions/logout'
import { toggleDrawer, toggleGroupMenu } from 'routes/PrimaryLayout/PrimaryLayout.store'

export function mapStateToProps (state, props) {
  const isPublic = props.routeParams.context === 'public'

  return {
    isPublic,
    isGroupMenuOpen: get('PrimaryLayout.isGroupMenuOpen', state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    logout: async () => {
      await dispatch(logout())
      dispatch(push('/login'))
    },
    toggleDrawer: () => dispatch(toggleDrawer()),
    toggleGroupMenu: props.width > 600 ? () => {} : (e) => { dispatch(toggleGroupMenu()); e.preventDefault() }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
