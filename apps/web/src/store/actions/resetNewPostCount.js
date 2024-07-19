import { RESET_NEW_POST_COUNT } from 'store/constants'

export default function resetNewPostCount (id, type) {
  if (!['GroupTopic', 'Membership'].includes(type)) {
    throw new Error(`bad type for resetNewPostCount: ${type}`)
  }

  return {
    type: RESET_NEW_POST_COUNT,
    graphql: {
      query: type === 'GroupTopic' ? GroupTopicQuery : MembershipQuery,
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

const GroupTopicQuery = `mutation($id: ID, $data: GroupTopicFollowInput) {
    updateGroupTopicFollow(id: $id, data: $data) {
      success
    }
  }`

const MembershipQuery = `mutation($id: ID, $data: MembershipInput) {
    updateMembership(groupId: $id, data: $data) {
      id
    }
  }`
