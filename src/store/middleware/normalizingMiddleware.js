import { castArray, curry, each, isEmpty } from 'lodash'
import { get, omit } from 'lodash/fp'

import transformer from '../transformers'
import { FETCH_POSTS, FETCH_FEEDITEMS } from '../constants'

export default function transformMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
          const posts = get('data.me.posts', payload)
          if (isEmpty(posts)) break
          dispatchRelations(dispatch, getPostRelations(posts))
          break
        case FETCH_FEEDITEMS:
          let feedItems = get('data.community.feedItems', payload)
          if (isEmpty(posts)) break
          dispatchRelations(dispatch, getFeedItemRelations(feedItems))
          break
      }
    }
    return next(action)
  }
}

function getFeedItemRelations (rawFeedItems) {
  const relabelled = rawFeedItems.map(({ name, content }) => ({ name, post: content }))
  const feeditems = {}
  addRelation(feeditems, relabelled, 'FeedItem')
  return {
    ...getPostRelations(relabelled.map(feedItem => feedItem.post)),
    feeditems
  }
}

function getPostRelations (rawPosts) {
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
function addRelation (relations, entities, transformer) {
  Object.assign(relations, transform(entities, transformer))
}

function transform (entities, entityType) {
  return [ ...castArray(entities) ]
    .reduce((acc, entity) => {
      acc[entity.id] = entityType ? transformer(entity, entityType) : entity
      return acc
    }, {})
}
