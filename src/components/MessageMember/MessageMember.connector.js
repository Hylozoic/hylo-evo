import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import getParam from 'store/selectors/getParam'
import getPerson from 'store/selectors/getPerson'

export function mapStateToProps (state, props) {
  const member = getPerson(state, {personId: getParam('id', state, props)})
  const currentUser = getMe(state, props)
  const isMe = currentUser && member && currentUser.id === member.id
  return {
    isMe,
    member
  }
}

export default connect(mapStateToProps)
