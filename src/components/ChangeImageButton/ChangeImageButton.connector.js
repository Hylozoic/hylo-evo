import { connect } from 'react-redux'
import { uploadImage } from './ChangeImageButton.store.js'
import { UPLOAD_IMAGE } from ''

export function mapStateToProps (state, { uploadSettings }) {
  const pending = state.pending[UPLOAD_IMAGE]
  console.log('pending', pending)
  console.log('uploadSettings', uploadSettings)
  return {
    loading: false
  }
}

export const mapDispatchToProps = {
  uploadImage
}

export default connect(mapStateToProps, mapDispatchToProps)
