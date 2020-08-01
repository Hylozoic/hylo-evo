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
    uploadAttachment: () => dispatch(uploadAttachment({ type, id, attachmentType }))
      .then(({ payload, error }) => {
        if (!error && payload) {
          return onSuccess(payload)
        }
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
