import { connect } from 'react-redux'
import { uploadImage } from './ChangeImageButton.store'
import { UPLOAD_IMAGE } from 'store/constants'
import { get } from 'lodash/fp'

export function mapStateToProps (state, { uploadSettings }) {
  const pending = state.pending[UPLOAD_IMAGE]
  const loading = get('id', pending) === get('id', uploadSettings) &&
    get('type', pending) === get('type', uploadSettings)

  return {
    loading
  }
}

export const mapDispatchToProps = {
  uploadImage
}

export default connect(mapStateToProps, mapDispatchToProps)
