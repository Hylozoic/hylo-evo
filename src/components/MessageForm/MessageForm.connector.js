import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import {
  getTextForMessageThread,
  createMessage,
  updateMessageText
} from './MessageForm.store'
import { CREATE_MESSAGE } from 'store/constants'
import { getSocket } from 'client/websockets'

export function mapStateToProps (state, props) {
  return {
    text: getTextForMessageThread(state, props),
    pending: !!state.pending[CREATE_MESSAGE],
    currentUser: getMe(state),
    socket: getSocket()
  }
}

export const mapDispatchToProps = {
  createMessage,
  updateMessageText
}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
