import { createSelector as ormCreateSelector } from 'redux-orm'
import { compact } from 'lodash/fp'
import orm from 'store/models'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import presentPost from 'store/presenters/presentPost'
import presentComment from 'store/presenters/presentComment'

export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'

const recentActivityQuery =
`query RecentActivity (
  $id: ID,
  $order: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $first: Int,
  $topic: ID
) {
  person (id: $id) {
    id
    comments (first: $first, order: $order) {
      items {
        id
        text
        creator {
          id
        }
        post {
          id
          title
        }
        attachments {
          id
          url
          type
        }
        createdAt
      }
    }
    ${postsQueryFragment}
  }
}`

export function fetchRecentActivity (id, first = 3, query = recentActivityQuery) {
  return {
    type: FETCH_RECENT_ACTIVITY,
    graphql: {
      query,
      variables: {id, first, order: 'desc'}
    },
    meta: { extractModel: 'Person' }
  }
}

// Deliberately preserves object references
// Intersperses posts and comments
export function indexActivityItems (comments, posts) {
  // descending order
  return comments.concat(posts)
    .sort((a, b) => {
      const aDate = new Date(a.createdAt)
      const bDate = new Date(b.createdAt)
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0
    })
}

export const getRecentActivity = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { routeParams }) => routeParams,
  ({ Person }, { personId, slug }) => {
    if (!Person.hasId(personId)) return
    const person = Person.withId(personId)
    const comments = compact(person.comments.toModelArray().map(comment =>
      presentComment(comment, slug)))
    const posts = compact(person.posts.toModelArray().map(post =>
      presentPost(post)))
    return indexActivityItems(comments, posts)
  })
