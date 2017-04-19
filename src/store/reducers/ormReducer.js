import * as a from 'store/constants'
import orm from 'store/models'
import ModelExtractor from './ModelExtractor'
import { FETCH_MEMBERS } from 'routes/Members/Members.store'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { Comment, Community, Membership, Person, Post, FeedItem } = session
  const { payload, type, meta, error } = action
  if (error) return state

  const add = addEntity(payload)
  const update = updateEntity(payload)
  const del = deleteEntity(payload)

  switch (type) {
    case a.ADD_COMMENT: add(Comment); break
    case a.UPDATE_COMMENT: update(Comment); break
    case a.DELETE_COMMENT: del(Comment); break

    case a.ADD_COMMUNITY: add(Community); break
    case a.UPDATE_COMMUNITY: update(Community); break
    case a.DELETE_COMMUNITY: del(Community); break

    case a.ADD_MEMBERSHIP: add(Membership); break
    case a.UPDATE_MEMBERSHIP: update(Membership); break
    case a.DELETE_MEMBERSHIP: del(Membership); break

    case a.ADD_PERSON: add(Person); break
    case a.UPDATE_PERSON: update(Person); break
    case a.DELETE_PERSON: del(Person); break

    case a.ADD_POST: add(Post); break
    case a.UPDATE_POST: update(Post); break
    case a.DELETE_POST: del(Post); break

    case a.ADD_FEED_ITEM: add(FeedItem); break
    case a.UPDATE_FEED_ITEM: update(FeedItem); break
    case a.DELETE_FEED_ITEM: del(FeedItem); break

    case a.FETCH_CURRENT_USER:
      ModelExtractor.addAll({
        session,
        root: payload.data.me,
        modelName: 'Me'
      })
      break

    case a.FETCH_POSTS:
      ModelExtractor.addAll({
        session,
        root: payload.data.community,
        modelName: meta.rootModelName
      })
      break

    case FETCH_MEMBERS:
      ModelExtractor.addAll({
        session,
        root: payload.data.community,
        modelName: 'Community'
      })
      break

    case a.FETCH_POST:
    case a.FETCH_COMMENTS:
    case a.CREATE_POST:
      ModelExtractor.addAll({
        session,
        root: payload.data.post,
        modelName: meta.rootModelName
      })
      break

    case a.CREATE_COMMENT:
      ModelExtractor.addAll({
        session,
        root: payload.data.createComment,
        modelName: 'Comment'
      })
      break
  }

  return session.state
}

function addEntity (payload) {
  return model => model.hasId(payload.id)
    ? model.withId(payload.id).update(payload)
    : model.create(payload)
}

function deleteEntity (payload) {
  return model => model.withId(payload.id).delete()
}

function updateEntity (payload) {
  return model => model.withId(payload.id).update(payload)
}
