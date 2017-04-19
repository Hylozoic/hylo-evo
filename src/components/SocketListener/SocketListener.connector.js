import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import { addMessageFromSocket, addThreadFromSocket } from './SocketListener.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = {
  addMessageFromSocket,
  addThreadFromSocket
}

export default connect(mapStateToProps, mapDispatchToProps)
