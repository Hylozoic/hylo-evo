import { castArray, each, isEmpty, keys } from 'lodash'
import { get, isObject, isArray, map } from 'lodash/fp'

import transformer from '../transformers'
import { FETCH_POSTS, FETCH_FEEDITEMS } from '../constants'

// Directory of types to process
// TODO: drag these out of model definitions?
const relations = {
  comments: 'Comment',
  communities: 'Community',
  creator: 'Person',
  feedItems: 'FeedItem',
  people: 'Person',
  posts: 'Post',
}

export default function normalizingMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
        case FETCH_FEEDITEMS:
          console.log(normalize(payload.data))
          //each(normalize(payload.data), dispatch)
          break
      }
    }
    return next(action)
  }
}

function normalize (graphqlResult) {
  return map(relation => getRelations(graphqlResult, relation))(keys(relations))
}

function getRelations (graphqlResult, relation) {
  let entities = {}
  each(graphqlResult, (val, key) => {
    if (key === relation) {
      console.log('RELATION:', key, ':', relations[relation])
      entities = {
        entities,
        ...transform(val, relations[relation])
      }
    }
    if (isObject(val) && !isArray(val)) getRelations(val, relation)
  })
  return entities
}

//function getFeedItemRelations (rawFeedItems) {
  //const slightlyCookedFeedItems = rawFeedItems.map(f =>
    //({...omit('content', f), post: f.content}))
  //const feeditems = {}
  //addRelation(feed_items, slightlyCookedFeedItems, 'FeedItem')
  //console.log('rawFeedItems', slightlyCookedFeedItems)
  //return {
    //...getPostRelations(slightlyCookedFeedItems.map(feedItem => feedItem.post)),
    //feed_items
  //}
//}

//function getPostRelations (rawPosts) {
  //if (rawPosts.length === 0) return {}

  //const normalize = curry(addRelation)
  //const relations = {
    //comments: {},
    //communities: {},
    //people: {},
    //posts: {}
  //}
  //const getComments = normalize(relations.comments)
  //const getCommunities = normalize(relations.communities)
  //const getPeople = normalize(relations.people)
  //const getPosts = normalize(relations.posts)

  //rawPosts.forEach(({ comments, communities, followers, creator }) =>
    //({
      //comments: normalize(comments, 'Comment'),
      //communities: normalize(communities, 'Community'),
      //followers: normalize(followers),
      //people: {
        //...normalize(creator),
        //...normalize(comments.map(c => c.creator))
      //}
    //})

      //getPeople(post.comments.map(c => c.creator), null)
    //}
    //if (post.communities) getCommunities(post.communities, 'Community')
    //if (post.followers) getPeople(post.followers, null)
    //if (post.creator) getPeople(post.creator, null)
    //getPosts(post, 'Post')
  //})

  //return relations
//}

//function dispatchRelations (dispatch, relations) {
  //each(relations, (relation, key) => {
    //if (!isEmpty(relation)) {
      //dispatch({
        //type: `ADD_${key.toUpperCase()}`,
        //payload: relation
      //})
    //}
  //})
//}

// Eliminate duplicate entries for various entities (by ID equality).
function transform (entities, entityType) {
  return [ ...castArray(entities) ]
    .reduce((acc, entity) => {
      acc[entity.id] = entityType ? transformer(entity, entityType) : entity
      return acc
    }, {})
}
