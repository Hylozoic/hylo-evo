import { connect } from 'react-redux'
import {
  setAttachments,
  clearAttachments,
  addAttachment,
  removeAttachment,
  moveAttachment,
  getAttachments,
  getAttachmentsFromObject,
  getUploadAttachmentPending
} from './AttachmentManager.store'

export function mapStateToProps (state, props) {
  return {
    uploadAttachmentPending: getUploadAttachmentPending(state, props),
    attachments: getAttachments(state, props),
    attachmentsFromObject: getAttachmentsFromObject(state, props)
  }
}

export const mapDispatchToProps = {
  addAttachment,
  removeAttachment,
  moveAttachment,
  setAttachments,
  clearAttachments
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { type, id, attachmentType } = ownProps
  const { attachmentsFromObject } = stateProps
  const { moveAttachment, setAttachments, clearAttachments } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    switchImages: (position1, position2) => moveAttachment(type, id, 'image', position1, position2),
    loadAttachments: () => setAttachments(type, id, attachmentType, attachmentsFromObject),
    clearAttachments: () => clearAttachments(type, id, attachmentType)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true })
