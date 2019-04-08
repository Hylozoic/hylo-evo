import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import {
  getTextForMessageThread,
  createMessage,
  updateMessageText
} from './MessageForm.store'
import { CREATE_MESSAGE, FIND_OR_CREATE_THREAD } from 'store/constants'
import { sendIsTyping } from 'client/websockets'

export function mapStateToProps (state, props) {
  return {
    text: getTextForMessageThread(state, props),
    pending: !!state.pending[CREATE_MESSAGE] || (props.forNewThread && !!state.pending[FIND_OR_CREATE_THREAD]),
    currentUser: getMe(state),
    sendIsTyping: sendIsTyping(props.messageThreadId)
  }
}

export const mapDispatchToProps = {
  createMessage,
  updateMessageText,
  goToThread: messageThreadId => push(`/t/${messageThreadId}`)
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { holochainActive } = ownProps
  const { createMessage } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    createMessage: (messageThreadId, text, forNewThread) => createMessage(messageThreadId, text, forNewThread, holochainActive)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, {withRef: true})
