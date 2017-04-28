import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import getPeopleTyping from 'store/selectors/getPeopleTyping'
import {
  addMessageFromSocket,
  addThreadFromSocket,
  addUserTyping,
  clearUserTyping
} from './SocketListener.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props),
    peopleTyping: getPeopleTyping(state)
  }
}

export const mapDispatchToProps = {
  addMessageFromSocket,
  addThreadFromSocket,
  addUserTyping,
  clearUserTyping
}

export default connect(mapStateToProps, mapDispatchToProps)
