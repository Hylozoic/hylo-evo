import { connect } from 'react-redux'
import {
  setAttachments,
  clearAttachments,
  addAttachment,
  removeAttachment,
  switchAttachments,
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
  switchAttachments,
  setAttachments,
  clearAttachments
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { type, id } = ownProps
  const { attachmentsFromObject } = stateProps
  const { switchAttachments, setAttachments, clearAttachments } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    switchAttachments: (attachmentType, position1, position2) => switchAttachments(type, id, attachmentType, position1, position2),
    loadAttachments: () => setAttachments(type, id, attachmentsFromObject),
    clearAttachments: () => clearAttachments(type, id)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true })
