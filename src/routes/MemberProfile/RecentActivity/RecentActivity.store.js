import { createSelector } from 'redux-orm'

import orm from 'store/models'

export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'

const recentActivityQuery =
`query RecentActivity ($id: ID, $order: String, $limit: Int) {
  person (id: $id) {
    id
    comments (first: $limit, order: $order) {
      id
      text
      creator {
        id
      }
      post {
        id
        title
      }
      createdAt
    }
    posts (first: $limit, order: $order) {
      id
      title
      details
      type
      creator {
        id
      }
      commenters {
        id,
        name,
        avatarUrl
      }
      commentersTotal
      communities {
        id
        name
      }
      createdAt
    }
  }
}`

export function fetchRecentActivity (id, order = 'desc', limit = 20, query = recentActivityQuery) {
  return {
    type: FETCH_RECENT_ACTIVITY,
    graphql: {
      query,
      variables: { id, limit, order }
    },
    meta: { extractModel: 'Person' }
  }
}

// Deliberately preserves object references
// Used to display interspersed posts and comments on 'Recent Activity'
export function indexActivityItems (comments, posts) {
  // TODO: support something other than descending order
  return comments.concat(posts)
    .sort((a, b) => {
      const aDate = new Date(a.createdAt)
      const bDate = new Date(b.createdAt)
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0
    })
}

export const activitySelector = createSelector(
  orm,
  state => state.orm,
  (_, { personId }) => personId,
  (_, { slug }) => slug,
  (session, personId, slug) => {
    if (session.Person.hasId(personId)) {
      const person = session.Person.withId(personId)
      const comments = person.comments.toModelArray().map(comment => ({
        ...comment.ref,
        creator: comment.creator.ref,
        post: comment.post.ref,
        slug
      }))
      const posts = person.posts.toModelArray().map(post => ({
        ...post.ref,
        creator: post.creator.ref,
        commenters: post.commenters.toRefArray(),
        communities: post.communities.toRefArray()
      }))
      return indexActivityItems(comments, posts)
    }
    return null
  }
)
