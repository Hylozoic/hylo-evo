import { isNull } from 'lodash'
import { connect } from 'react-redux'
import { checkLogin } from '../Login/Login.store'

export function mapStateToProps (state) {
  return {
    hasCheckedLogin: !isNull(state.login.isLoggedIn)
  }
}

const mapDispatchToProps = { checkLogin }

export default connect(mapStateToProps, mapDispatchToProps)
