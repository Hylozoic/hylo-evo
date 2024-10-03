import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getRouteParam from 'store/selectors/getRouteParam'
import getQuerystringParam from 'store/selectors/getQuerystringParam'

const getPost = ormCreateSelector(
  orm,
  (state, id) => id,
  ({ Post }, id) => {
    return Post.withId(id)
  }
)

export default getPost
