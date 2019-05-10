import { connect } from 'react-redux'
import { mockCheckLogin } from '../Login/Login.store'
import { isNull } from 'lodash'

export function mapStateToProps (state) {
  return {
    hasCheckedLogin: !isNull(state.login.isLoggedIn)
  }
}

const mapDispatchToProps = { checkLogin: mockCheckLogin }

export default connect(mapStateToProps, mapDispatchToProps)
