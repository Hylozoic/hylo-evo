import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { sendIsTyping } from 'client/websockets'
import { addAttachment } from 'components/AttachmentManager/AttachmentManager.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    sendIsTyping: sendIsTyping(props.postId)
  }
}

export default connect(mapStateToProps, { addAttachment })
