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
    uploadAttachment: () => dispatch(uploadAttachment({ id, type, attachmentType }))
      .then(({ payload, error }) => {
        if (!error && payload.url) {
          return onSuccess(payload.url)
        }
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
