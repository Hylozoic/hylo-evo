import { connect } from 'react-redux'
import uploadAttachment, { uploadAttachmentUsingFilestackLibrary } from 'store/actions/uploadAttachment'
import getUploadPending from 'store/selectors/getUploadPending'

export function mapStateToProps (state, props) {
  return {
    loading: getUploadPending(state, props)
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    uploadAttachment: (type, id, attachment) =>
      dispatch(uploadAttachment(type, id, attachment)),
    uploadAttachmentUsingFilestackLibrary: (type, id, attachmentType) =>
      dispatch(uploadAttachmentUsingFilestackLibrary({ type, id, attachmentType }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
