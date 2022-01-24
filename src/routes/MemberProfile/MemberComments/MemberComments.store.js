import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { compact } from 'lodash/fp'
import presentComment from 'store/presenters/presentComment'
import gql from 'graphql-tag'

export const FETCH_MEMBER_COMMENTS = 'FETCH_MEMBER_COMMENTS'

const memberCommentsQuery = gql`
  query MemberComments ($id: ID, $order: String, $limit: Int) {
    person (id: $id) {
      id
      comments (first: $limit, order: $order) {
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
    }
  }
`

export function fetchMemberComments (id, order = 'desc', limit = 20, query = memberCommentsQuery) {
  return {
    type: FETCH_MEMBER_COMMENTS,
    graphql: {
      query,
      variables: { id, limit, order }
    },
    meta: { extractModel: 'Person' }
  }
}

export const getMemberComments = ormCreateSelector(
  orm,
  (_, { routeParams }) => routeParams,
  ({ Person }, { personId, slug }) => {
    if (!Person.idExists(personId)) return
    const person = Person.withId(personId)
    return compact(person.comments.toModelArray().map(comment => presentComment(comment, slug)))
      .sort(c => c.createdAt)
  }
)
