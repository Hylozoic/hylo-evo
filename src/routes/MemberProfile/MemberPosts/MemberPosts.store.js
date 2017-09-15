import { createSelector } from 'redux-orm'
import orm from 'store/models'
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
  $topic: Int
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

export const memberPostsSelector = createSelector(
  orm,
  state => state.orm,
  (_, { personId }) => personId,
  (_, { slug }) => slug,
  (session, personId, slug) => {
    if (session.Person.hasId(personId)) {
      const person = session.Person.withId(personId)
      return person.posts.toModelArray().map(post => ({
        ...post.ref,
        creator: post.creator.ref,
        linkPreview: post.linkPreview,
        commenters: post.commenters.toRefArray(),
        communities: post.communities.toRefArray(),
        fileAttachments: post.attachments.filter(a => a.type === 'file').toModelArray()
      }))
    }
    return null
  }
)
