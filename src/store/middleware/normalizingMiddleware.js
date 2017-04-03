import { each, isEmpty } from 'lodash'
import { get, snakeCase } from 'lodash/fp'
import normalize from '../normalize'
import { FETCH_POSTS, FETCH_FEED_ITEMS } from '../constants'

export default function normalizingMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
          const posts = get('data.me.posts', payload)
          if (isEmpty(posts)) break
          dispatchRelations(dispatch, getPostRelations(posts))
          break
        case FETCH_FEED_ITEMS:
          let feedItems = get('data.community.feedItems', payload)

          if (isEmpty(feedItems)) break
          dispatchRelations(dispatch, getFeedItemRelations(feedItems))
          break
      }
    }
    return next(action)
  }
}

function transformFeedItem ({ type, content }) {
  // this assumes that all feed items contain posts. This will change
  // and that all feed items content will have an id. This should not change
  return {
    id: `${type}_${content.id}`,
    type,
    post: content
  }
}

function getFeedItemRelations (rawFeedItems) {
  const relabelled = rawFeedItems.map(transformFeedItem)

  return {
    ...getPostRelations(relabelled.map(feedItem => feedItem.post)),
    feedItems: relabelled.map(f => normalize(f, 'FeedItem'))
  }
}

function getPostRelations (rawPosts) {
  const relations = {
    comments: [],
    communities: [],
    people: [],
    posts: []
  }

  rawPosts.forEach(post => {
    if (post.comments) {
      relations.comments = relations.comments.concat(post.comments.map(c => normalize(c, 'Comment')))
      relations.people = relations.people.concat(post.comments.map(c => c.creator))
    }
    if (post.communities) {
      relations.communities = relations.communities.concat(post.communities.map(c => normalize(c, 'Community')))
    }
    if (post.followers) {
      relations.people = relations.people.concat(post.followers)
    }
    if (post.creator) {
      relations.people.push(post.creator)
    }
    relations.posts = relations.posts.concat(normalize(post, 'Post'))
  })

  return relations
}

function dispatchRelations (dispatch, relations) {
  each(relations, (relation, key) => {
    if (!isEmpty(relation)) {
      dispatch({
        type: `ADD_${snakeCase(key).toUpperCase()}`,
        payload: relation
      })
    }
  })
}
