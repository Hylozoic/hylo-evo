import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export function mapStateToProps (state, props) {
  return {imageUrl: get('url', getImage(state, props))}
}

export default connect(mapStateToProps)

const getImage = ormCreateSelector(
  orm,
  get('orm'),
  (state, { postId }) => postId,
  ({ Attachment }, postId) =>
    Attachment.all().filter(({ type, post, position }) =>
      type === 'image' && post === postId && position === 0)
    .first()
)
