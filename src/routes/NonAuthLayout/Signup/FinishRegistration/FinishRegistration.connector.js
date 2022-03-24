import { connect } from 'react-redux'
import getGraphqlResponseError from 'store/selectors/getGraphqlResponseError'
import getMe from 'store/selectors/getMe'
import { register } from '../Signup.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)

  return {
    currentUser,
    error: getGraphqlResponseError(state)
  }
}

export const mapDispatchToProps = {
  register
}

export default connect(mapStateToProps, mapDispatchToProps)
