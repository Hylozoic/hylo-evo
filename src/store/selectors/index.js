import { orm } from '../models'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'

// Selects the state managed by Redux-ORM.
export const ormSelector = state => state.orm

export const getPostById = createSelector(
  ormSelector,
  (state, props) => props.id,
  ormCreateSelector(orm, (session, postId) => {
    if (session.Post.hasId(postId)) return session.Post.withId(postId).ref
  })
)
