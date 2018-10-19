import { createSelector } from 'redux-orm'
import orm from 'store/models'
import { presentPost } from 'store/selectors/getPost'
import { FETCH_MEMBER_POSTS } from '../MemberProfile.store'
import { postsQueryFragment } from 'components/FeedList/FeedList.store'

const memberPostsQuery =
`query MemberPosts (
  $id: ID,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $first: Int,
  $topic: ID
) {
  person (id: $id) {
    id
    ${postsQueryFragment}
  }
}`

export function fetchMemberPosts (id, first = 20, query = memberPostsQuery) {
  return {
    type: FETCH_MEMBER_POSTS,
    graphql: {
      query,
      variables: {id, first}
    },
    meta: {extractModel: 'Person'}
  }
}

// TODO: Use ORM selector so defaults are correct
//       also, use getPost > presentPost?
export const memberPostsSelector = createSelector(
  orm,
  state => state.orm,
  (_, { personId }) => personId,
  (_, { slug }) => slug,
  (session, personId, slug) => {
    if (session.Person.hasId(personId)) {
      const person = session.Person.withId(personId)
      const results = person.posts.toModelArray().map(post => presentPost(post))
      return results
    }
    return null
  }
)
