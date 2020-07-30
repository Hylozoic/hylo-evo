import { isEmpty } from 'lodash/fp'
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
  const pending = getUploadPending(state, props)
  const attachments = getAttachments(state, props)
  const attachmentsFromObject = getAttachmentsFromObject(state, props)
  const showAttachments = !isEmpty(attachments) || pending // last clause is for testing only
  return {
    pending,
    attachments,
    attachmentsFromObject,
    showAttachments
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
  const { addAttachment, removeAttachment, switchAttachments, setAttachments } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addAttachment: url => addAttachment(type, id, attachmentType, url),
    removeAttachment: position => removeAttachment(type, id, attachmentType, position),
    switchAttachments: (position1, position2) => switchAttachments(type, id, attachmentType, position1, position2),
    loadAttachments: () => setAttachments(type, id, attachmentType, attachmentsFromObject),
    clearAttachments: () => setAttachments(type, id, attachmentType, [])
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
