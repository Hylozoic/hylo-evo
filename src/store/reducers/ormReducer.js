import { each } from 'lodash'

import * as a from 'store/constants'
import orm from 'store/models'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { Comment, Community, Person, Post, FeedItem } = session
  const { payload, type } = action

  const add = addEntities(payload)
  const update = updateEntity(payload)
  const del = deleteEntity(payload)

  switch (type) {
    case a.ADD_COMMENTS: add(Comment); break
    case a.UPDATE_COMMENT: update(Comment); break
    case a.DELETE_COMMENT: del(Comment); break

    case a.ADD_COMMUNITIES: add(Community); break
    case a.UPDATE_COMMUNITY: update(Community); break
    case a.DELETE_COMMUNITY: del(Community); break

    case a.ADD_PEOPLE: add(Person); break
    case a.UPDATE_PERSON: update(Person); break
    case a.DELETE_PERSON: del(Person); break

    case a.ADD_POSTS: add(Post); break
    case a.UPDATE_POST: update(Post); break
    case a.DELETE_POST: del(Post); break

    case a.ADD_FEEDITEMS:
      add(FeedItem);
      break
    case a.UPDATE_FEEDITEM: update(FeedItem); break
    case a.DELETE_FEEDITEM: del(FeedItem); break
  }

  return session.state
}

function addEntities (payload) {
  return model => {
    each(payload, entity =>
      model.hasId(entity.id) ? model.update(entity) : model.create(entity))
  }
}

function deleteEntity (payload) {
  return model => model.withId(payload.id).delete()
}

function updateEntity (payload) {
  return model => model.withId(payload.id).update(payload)
}
