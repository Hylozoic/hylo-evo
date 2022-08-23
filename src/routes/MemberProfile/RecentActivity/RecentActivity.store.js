import { createSelector as ormCreateSelector } from 'redux-orm'
import { compact } from 'lodash/fp'
import orm from 'store/models'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import presentPost from 'store/presenters/presentPost'
import presentComment from 'store/presenters/presentComment'

export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'

const recentActivityQuery =
`query RecentActivity (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $filter: String,
  $first: Int,
  $groupSlugs: [String],
  $id: ID,
  $isFulfilled: Boolean,
  $offset: Int,
  $context: String,
  $order: String,
  $search: String,
  $sortBy: String,
  $topic: ID,
  $topics: [ID],
  $types: [String]
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
          type
          url
          position
          id
        }
        createdAt
      }
    }
    ${postsQueryFragment}
  }
}`

export function fetchRecentActivity (id, first = 10, query = recentActivityQuery) {
  return {
    type: FETCH_RECENT_ACTIVITY,
    graphql: {
      query,
      variables: { id, first, order: 'desc' }
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
  (_, { routeParams }) => routeParams,
  ({ Person }, { personId, slug }) => {
    if (!Person.idExists(personId)) return
    const person = Person.withId(personId)
    const comments = compact(person.comments.toModelArray().map(comment =>
      presentComment(comment, slug)))
    const posts = compact(person.posts.toModelArray().map(post =>
      presentPost(post)))
    return indexActivityItems(comments, posts)
  })
