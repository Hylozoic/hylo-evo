import { connect } from 'react-redux'
import getUploadPending from 'store/selectors/getUploadPending'
import getAttachmentsFromObject from 'store/selectors/getAttachmentsFromObject'
import {
  getAttachments,
  setAttachments,
  clearAttachments,
  addAttachment,
  removeAttachment,
  switchAttachments
} from './AttachmentManager.store'

export function mapStateToProps (state, props) {
  return {
    uploadPending: getUploadPending(state, props),
    attachments: getAttachments(state, props),
    attachmentsFromObject: getAttachmentsFromObject(state, props)
  }
}

export const mapDispatchToProps = {
  addAttachment,
  removeAttachment,
  switchAttachments,
  setAttachments
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { type, id, attachmentType } = ownProps
  const { attachmentsFromObject } = stateProps
  const { switchAttachments, setAttachments } = dispatchProps
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
