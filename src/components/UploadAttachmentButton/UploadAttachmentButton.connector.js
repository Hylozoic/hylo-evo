import { connect } from 'react-redux'
import uploadAttachment, { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import getUploadPending from 'store/selectors/getUploadPending'

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
    uploadAttachment: () => dispatch(uploadAttachment({ type, id, attachmentType }))
      .then(({ payload, error }) => {
        if (!error && payload) {
          return onSuccess(payload)
        }
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
