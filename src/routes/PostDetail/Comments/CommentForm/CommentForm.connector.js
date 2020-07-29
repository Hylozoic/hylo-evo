import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { sendIsTyping } from 'client/websockets'
import {
  addAttachment,
  setAttachments
  // getAttachments
} from 'components/AttachmentManager/AttachmentManager.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    sendIsTyping: sendIsTyping(props.postId)
    // images: getAttachments(state, { id: 'new', type: 'comment', image: true }),
    // files: getAttachments(state, { id: 'new', type: 'comment' })
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    addImage: url => dispatch(addAttachment('comment', 'new', 'image', url)),
    addFile: url => dispatch(addAttachment('comment', 'new', 'file', url)),
    clearAttachments: () => {
      dispatch(setAttachments('comment', 'new', 'image', []))
      dispatch(setAttachments('comment', 'new', 'file', []))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
