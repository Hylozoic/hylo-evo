import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import getParam from 'store/selectors/getParam'
import getPerson from 'store/selectors/getPerson'

export function mapStateToProps (state, props) {
  const member = getPerson(state, {personId: getParam('id', state, props)})
  const currentUser = getMe(state, props)
  return {
    currentUserId: currentUser.id,
    member
  }
}

export default connect(mapStateToProps)
