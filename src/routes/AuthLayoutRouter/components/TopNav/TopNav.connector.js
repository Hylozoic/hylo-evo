import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { replace } from 'connected-react-router'
import logout from 'store/actions/logout'
import { toggleDrawer, toggleGroupMenu } from 'routes/AuthLayoutRouter/AuthLayoutRouter.store'

export function mapStateToProps (state, props) {
  const isPublic = props.routeParams.context === 'public'

  return {
    isPublic,
    isGroupMenuOpen: get('AuthLayoutRouter.isGroupMenuOpen', state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    logout: async () => {
      dispatch(replace('/login', null))
      await dispatch(logout())
    },
    toggleDrawer: () => dispatch(toggleDrawer()),
    toggleGroupMenu: props.width > 600 ? () => {} : (e) => { dispatch(toggleGroupMenu()); e.preventDefault() }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
