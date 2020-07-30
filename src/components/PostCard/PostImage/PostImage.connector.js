import { connect } from 'react-redux'
import { isEmpty } from 'lodash/fp'
import getAttachmentsFromObject from 'store/selectors/getAttachmentsFromObject'

export function mapStateToProps (state, props) {
  const imageUrls = getAttachmentsFromObject(state, {
    type: 'post',
    id: props.postId,
    attachmentType: 'image'
  })

  if (isEmpty(imageUrls)) return {}

  return {
    imageUrl: imageUrls[0],
    otherImageUrls: imageUrls.slice(1)
  }
}

export default connect(mapStateToProps)
