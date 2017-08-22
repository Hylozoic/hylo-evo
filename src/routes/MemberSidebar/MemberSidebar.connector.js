import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const memberId = getParam('id', state, props)

  return {
    currentUser,
    memberId
  }
}

export default connect(mapStateToProps)
