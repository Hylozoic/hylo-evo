import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { sendIsTyping } from 'client/websockets.mjs'
import { addAttachment, getAttachments, clearAttachments } from 'components/AttachmentManager/AttachmentManager.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    sendIsTyping: sendIsTyping(props.postId),
    attachments: getAttachments(state, { type: 'comment', id: 'new' })
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    addAttachment: attachment => dispatch(addAttachment('comment', 'new', attachment)),
    clearAttachments: () => dispatch(clearAttachments('comment'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
