import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { sendIsTyping } from 'client/websockets'
import { addAttachment, getAttachments, clearAttachments } from 'components/AttachmentManager/AttachmentManager.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    sendIsTyping: sendIsTyping(props.postId),
    attachments: getAttachments(state, { type: 'comment', id: 'new' })
  }
}

export default connect(mapStateToProps, { addAttachment, clearAttachments })
