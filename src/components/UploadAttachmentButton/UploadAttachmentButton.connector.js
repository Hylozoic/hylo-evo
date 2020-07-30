import { connect } from 'react-redux'
import { getUploadPending, uploadAttachment, ID_FOR_NEW } from 'components/AttachmentManager/AttachmentManager.store'

export function mapStateToProps (state, props) {
  return {
    loading: getUploadPending(state, props)
  }
}

export function mapDispatchToProps (dispatch, {
  id = ID_FOR_NEW,
  type,
  attachmentType,
  onSuccess
}) {
  return {
    uploadAttachment: () => dispatch(uploadAttachment({ id, type, attachmentType }))
      .then(({ payload, error }) => {
        if (!error && payload.url) {
          return onSuccess(payload.url)
        }
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
