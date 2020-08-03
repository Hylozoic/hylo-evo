import { connect } from 'react-redux'
import uploadAttachment, { uploadAttachmentUsingPicker } from 'store/actions/uploadAttachment'
import getUploadPending from 'store/selectors/getUploadPending'

export function mapStateToProps (state, props) {
  return {
    loading: getUploadPending(state, props)
  }
}

export function mapDispatchToProps (dispatch, {
  id,
  type,
  attachmentType,
  onSuccess
}) {
  return {
    uploadAttachmentUsingPicker: () => dispatch(uploadAttachmentUsingPicker({ type, id, attachmentType }))
      .then(response => {
        if (response && !response.error && response.payload) {
          return onSuccess(response.payload)
        }
      }),
    uploadAttachment: attachment => uploadAttachment(type, id, attachment)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
