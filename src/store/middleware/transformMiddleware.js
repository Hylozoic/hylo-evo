import { curry, isEmpty } from 'lodash'

import transformComment from '../transformers/commentTransformer'
import transformCommunity from '../transformers/communityTransformer'
import transformPost from '../transformers/postTransformer'
import { FETCH_POSTS } from '../constants'

export default function transformMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
          if (payload.length === 0) break
          dispatchRelations(dispatch, getRelations(payload))
          break
      }
    }
    return next(action)
  }
}

function getRelations (rawPosts) {
  if (rawPosts.length === 0) return {}

  const normalize = curry(addRelation)
  const relations = {
    comments: {},
    communities: {},
    people: {},
    posts: {}
  }
  const getComments = normalize(relations.comments)
  const getCommunities = normalize(relations.communities)
  const getPeople = normalize(relations.people)
  const getPosts = normalize(relations.posts)

  rawPosts.forEach(post => {
    if (post.comments) {
      getComments(post.comments, transformComment)
      getPeople(post.comments.map(c => c.creator), null)
    }
    if (post.communities) getCommunities(post.communities, transformCommunity)
    if (post.followers) getPeople(post.followers, null)
    if (post.creator) getPeople(post.creator, null)
    getPosts(post, transformPost)
  })

  return relations
}

function dispatchRelations (dispatch, relations) {
  Object.keys(relations).forEach(key => {
    if (!isEmpty(relations[key])) {
      dispatch({
        type: `ADD_${key.toUpperCase()}`,
        payload: relations[key]
      })
    }
  })
}

// Eliminate duplicate entries for various entities (by ID equality).
// Deliberately has side-effects!
function addRelation (realtions, entities, transformer) {
  Object.assign(realtions, transform(entities, transformer))
}

function ensureArray (entities) {
  return entities.constructor === Array ? entities : [ entities ]
}

function transform (entities, transformer) {
  return [ ...ensureArray(entities) ]
    .reduce((acc, entity) => {
      acc[entity.id] = transformer ? transformer(entity) : entity
      return acc
    }, {})
}
