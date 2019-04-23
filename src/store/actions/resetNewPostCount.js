import { RESET_NEW_POST_COUNT } from 'store/constants'

export default function resetNewPostCount (id, type) {
  if (!['CommunityTopic', 'Membership'].includes(type)) {
    throw new Error(`bad type for resetNewPostCount: ${type}`)
  }

  return {
    type: RESET_NEW_POST_COUNT,
    graphql: {
      query: type === 'CommunityTopic' ? CommunityTopicQuery : MembershipQuery,
      variables: {
        id,
        data: {
          newPostCount: 0
        }
      }
    },
    meta: { id, type, optimistic: true }
  }
}

const CommunityTopicQuery = `mutation($id: ID, $data: CommunityTopicInput) {
    updateCommunityTopic(id: $id, data: $data) {
      success
    }
  }`

const MembershipQuery = `mutation($id: ID, $data: MembershipInput) {
    updateMembership(communityId: $id, data: $data) {
      id
    }
  }`
