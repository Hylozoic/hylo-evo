import { connect } from 'react-redux'
import { uploadImage } from './ChangeImageButton.store.js'
import { UPLOAD_IMAGE } from 'store/constants'
import { get } from 'lodash/fp'

export function mapStateToProps (state, { uploadSettings }) {
  const pending = state.pending[UPLOAD_IMAGE]
  const loading = get('id', pending) === get('id', uploadSettings) &&
    get('subject', pending) === get('subject', uploadSettings)

  return {
    loading
  }
}

export const mapDispatchToProps = {
  uploadImage
}

export default connect(mapStateToProps, mapDispatchToProps)
