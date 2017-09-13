import { isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import { UPLOAD_IMAGE } from 'store/constants'
import {
  addImagePreview,
  removeImagePreview,
  switchImagePreviews,
  setImagePreviews,
  getImagePreviews,
  getImages
} from './ImagePreviews.store'

export function mapStateToProps (state, props) {
  const uploadImagePending = state.pending[UPLOAD_IMAGE]
  const imagePreviews = getImagePreviews(state, props)
  const showImagePreviews = !isEmpty(imagePreviews) || uploadImagePending
  const postImages = getImages(state, props)

  return {
    imagePreviews,
    postImages,
    showImagePreviews,
    uploadImagePending
  }
}

export const mapDispatchToProps = {
  addImagePreview,
  removeImagePreview,
  switchImagePreviews,
  setImagePreviews
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { postImages } = stateProps
  const { setImagePreviews } = dispatchProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    loadImagePreviews: () => setImagePreviews(postImages.map(image => image.url)),
    clearImagePreviews: () => setImagePreviews([])
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
