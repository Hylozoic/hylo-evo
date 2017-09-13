import { isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import { UPLOAD_IMAGE } from 'store/constants'
import {
  addAttachment,
  removeAttachment,
  switchAttachments,
  setAttachments,
  getAttachments,
  makeAttachmentSelector
} from './AttachmentManager.store'

export function mapStateToProps (state, props) {
  const uploadImagePending = state.pending[UPLOAD_IMAGE]
  const attachments = getAttachments(state, props)
  const attachmentsFromPost = makeAttachmentSelector(props.type)(state, props)
  const showAttachments = !isEmpty(attachments) || uploadImagePending

  return {
    attachments,
    attachmentsFromPost,
    showAttachments,
    uploadImagePending
  }
}

export const mapDispatchToProps = {
  addAttachment,
  removeAttachment,
  switchAttachments,
  setAttachments
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { type } = ownProps
  const { attachmentsFromPost } = stateProps
  const { addAttachment, removeAttachment, switchAttachments, setAttachments } = dispatchProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addAttachment: url => addAttachment(url, type),
    removeAttachment: position => removeAttachment(position, type),
    switchAttachments: (position1, position2) => switchAttachments(position1, position2, type),
    loadAttachments: () => setAttachments(attachmentsFromPost.map(attachment => attachment.url), type),
    clearAttachments: () => setAttachments([], type)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
