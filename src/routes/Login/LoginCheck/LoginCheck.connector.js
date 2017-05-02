import { connect } from 'react-redux'
import { checkLogin } from '../Login.store'
import { isNull } from 'lodash'

export function mapStateToProps (state) {
  return {
    hasCheckedLogin: !isNull(state.Login.isLoggedIn)
  }
}

const mapDispatchToProps = {checkLogin}

export default connect(mapStateToProps, mapDispatchToProps)
