import { connect } from 'react-redux'
import { upload } from './ChangeImageButton.store'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export function mapStateToProps (state, { uploadSettings, attachmentType }) {
  const pending = state.pending[UPLOAD_ATTACHMENT]
  const loading = !!pending &&
    pending.id === uploadSettings.id &&
    pending.type === uploadSettings.type &&
    pending.attachmentType === attachmentType

  return { loading }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    upload: () =>
      dispatch(upload({
        ...props.uploadSettings,
        attachmentType: props.attachmentType || 'image'
      }))
        .then(({ error, payload }) =>
          !error && payload.url && props.update(payload.url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
