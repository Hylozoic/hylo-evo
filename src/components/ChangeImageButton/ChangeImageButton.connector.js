import { connect } from 'react-redux'
import { uploadImage } from './ChangeImageButton.store'
import { UPLOAD_IMAGE } from 'store/constants'

export function mapStateToProps (state, { uploadSettings }) {
  const pending = state.pending[UPLOAD_IMAGE]
  const loading = !!pending &&
    pending.id === uploadSettings.id &&
    pending.type === uploadSettings.type

  return {loading}
}

export const mapDispatchToProps = {
  uploadImage
}

export default connect(mapStateToProps, mapDispatchToProps)
