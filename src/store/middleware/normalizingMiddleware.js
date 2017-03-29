import { castArray, curry, each, isEmpty } from 'lodash'

import transformer from '../transformers'
import { FETCH_POSTS } from '../constants'

export default function transformMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      console.log('in transformMiddleware', action)

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

  console.log('rawPosts', rawPosts)

  rawPosts.forEach(post => {
    if (post.comments) {
      getComments(post.comments, 'Comment')
      getPeople(post.comments.map(c => c.creator), null)
    }
    if (post.communities) getCommunities(post.communities, 'Community')
    if (post.followers) getPeople(post.followers, null)
    if (post.creator) getPeople(post.creator, null)
    getPosts(post, 'Post')
  })

  return relations
}

function dispatchRelations (dispatch, relations) {
  each(relations, (relation, key) => {
    if (!isEmpty(relation)) {
      dispatch({
        type: `ADD_${key.toUpperCase()}`,
        payload: relation
      })
    }
  })
}

// Eliminate duplicate entries for various entities (by ID equality).
// Deliberately has side-effects!
function addRelation (realtions, entities, transformer) {
  Object.assign(realtions, transform(entities, transformer))
}

function transform (entities, entityType) {
  return [ ...castArray(entities) ]
    .reduce((acc, entity) => {
      acc[entity.id] = entityType ? transformer(entity, entityType) : entity
      return acc
    }, {})
}
