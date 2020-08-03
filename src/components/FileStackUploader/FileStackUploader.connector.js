import { connect } from 'react-redux'
import uploadAttachment from 'store/actions/uploadAttachment'
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
    uploadAttachment: result => dispatch(uploadAttachment(type, id, result))
      .then(result => onSuccess(result.payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
