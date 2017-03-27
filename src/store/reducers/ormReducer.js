import { each } from 'lodash'

import * as a from 'store/constants'
import { orm } from 'store/models'

export default function ormReducer (state = {}, action) {
  const { error, type, payload } = action
  if (error) return state

  const session = orm.session(state)
  const { Comment, Community, Person, Post } = session

  switch (type) {
    case a.ADD_COMMENTS:
      each(payload, comment =>
        Comment.hasId(comment.id) ? Comment.update(comment) : Comment.create(comment))
      break

    case a.DELETE_COMMENT:
      Comment.withId(payload.id).delete()
      break

    case a.UPDATE_COMMENT:
      Comment.withId(payload.id).update(payload)
      break

    case a.ADD_COMMUNITIES:
      each(payload, community =>
        Community.hasId(community.id) ? Community.update(community) : Community.create(community))
      break

    case a.DELETE_COMMUNITY:
      Community.withId(payload.id).delete()
      break

    case a.UPDATE_COMMUNITY:
      Community.withId(payload.id).update(payload)
      break

    case a.ADD_PEOPLE:
      each(payload, person =>
        Person.hasId(person.id) ? Person.update(person) : Person.create(person))
      break

    case a.DELETE_PERSON:
      Person.withId(payload.id).delete()
      break

    case a.UPDATE_PERSON:
      Person.withId(payload.id).update(payload)
      break

    case a.ADD_POSTS:
      each(payload, post =>
        Post.hasId(post.id) ? Post.update(post) : Post.create(post))
      break

    case a.DELETE_POST:
      Post.withId(payload.id).delete()
      break

    case a.upDATE_POST:
      Post.withId(payload.id).update(payload)
      break
  }

  return session.state
}
