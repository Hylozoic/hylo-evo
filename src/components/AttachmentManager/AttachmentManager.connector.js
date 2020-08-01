import { connect } from 'react-redux'
import getUploadPending from 'store/selectors/getUploadPending'
import getAttachmentsFromObject from 'store/selectors/getAttachmentsFromObject'
import {
  addAttachment,
  removeAttachment,
  switchAttachments,
  setAttachments,
  getAttachments
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
    switchAttachments: (position1, position2) => switchAttachments(type, id, attachmentType, position1, position2),
    loadAttachments: () => setAttachments(type, id, attachmentType, attachmentsFromObject),
    clearAttachments: () => setAttachments(type, id, attachmentType, [])
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true })
