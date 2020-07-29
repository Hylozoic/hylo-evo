import { connect } from 'react-redux'
import { getUploadPending, uploadAttachment } from 'components/AttachmentManager/AttachmentManager.store'

export function mapStateToProps (state, props) {
  return {
    loading: getUploadPending(state, props)
  }
}

export function mapDispatchToProps (dispatch, {
  id,
  type,
  attachmentType,
  update
}) {
  return {
    upload: () => dispatch(uploadAttachment({ id, type, fileType: attachmentType }))
      .then(({ payload, error }) => !error && payload.url && update(payload.url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
