import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export function mapStateToProps (state, props) {
  const images = getImagesForPost(state, props)
  if (isEmpty(images)) return {}

  return {
    imageUrl: images[0].url,
    otherImageUrls: images.slice(1).map(get('url'))
  }
}

export default connect(mapStateToProps)

const getImagesForPost = ormCreateSelector(
  orm,
  get('orm'),
  (state, { postId }) => postId,
  ({ Attachment }, postId) =>
    Attachment.all()
    .filter(({ type, post }) => type === 'image' && post === postId)
    .orderBy(get('position'))
    .toRefArray()
)
