import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getRouteParam from 'store/selectors/getRouteParam'

const getPost = ormCreateSelector(
  orm,
  (state, props) => getRouteParam('postId', state, props),
  ({ Post }, id) => {
    return Post.withId(id)
  }
)

export default getPost
