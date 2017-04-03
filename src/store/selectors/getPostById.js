import orm from '../models'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'

export const getPostById = createSelector(
  (state, props) => props.id,
  ormCreateSelector(orm, (session, postId) => {
    if (session.Post.hasId(postId)) {
      return session.Post.withId(postId)
    }
  })
)
