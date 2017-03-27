import { each } from 'lodash'
import { combineReducers } from 'redux'

import { ADD_COMMENTS, ADD_COMMUNITIES, ADD_PEOPLE, ADD_POSTS } from 'store/constants'
import { orm } from 'store/models'

export default function ormReducer (state = {}, action) {
  const { error, type, payload } = action
  if (error) return state

  const session = orm.session(state)
  const { Comment, Community, Person, Post } = session

  switch (type) {
    case ADD_COMMENTS:
      each(payload, comment => Comment.create(comment))
      break

    case ADD_COMMUNITIES:
      each(payload, community => Community.create(community))
      break

    case ADD_PEOPLE:
      each(payload, person => Person.create(person))
      break

    case ADD_POSTS:
      each(payload, post => Post.create(post))
      break
  }

  return session.state
}
