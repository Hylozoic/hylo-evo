import { connect } from 'react-redux'
import { uploadImage } from './UploadPhoto.store.js'
import { UPLOAD_IMAGE } from 'store/constants'
import { get } from 'lodash/fp'

import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { uploadSettings } = props
  const pending = state.pending[UPLOAD_IMAGE]
  const loading = get('id', pending) === get('id', uploadSettings) &&
    get('subject', pending) === get('subject', uploadSettings)

  return {
    currentUser: getMe(state),
    loading
  }
}

export const mapDispatchToProps = {
  uploadImage
}

export default connect(mapStateToProps, mapDispatchToProps)
