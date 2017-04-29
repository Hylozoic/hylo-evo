import { connect } from 'react-redux'
import {
  addMessageFromSocket,
  addThreadFromSocket
} from './SocketListener.store'
import {
  addUserTyping,
  clearUserTyping
} from 'components/PeopleTyping/PeopleTyping.store'

export const mapDispatchToProps = {
  addMessageFromSocket,
  addThreadFromSocket,
  addUserTyping,
  clearUserTyping
}

export default connect(null, mapDispatchToProps)
