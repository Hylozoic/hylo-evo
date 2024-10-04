import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

// protest selector
const getPostById = ormCreateSelector(
  orm,
  (state, id) => id,
  ({ Post }, id) => {
    return Post.withId(id)
  }
)

export default getPostById
