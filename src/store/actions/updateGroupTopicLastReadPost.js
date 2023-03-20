import { UPDATE_GROUP_TOPIC_LAST_READ_POST } from 'store/constants'

export default function updateGroupTopicLastReadPost (id, lastReadPostId) {
  return {
    type: UPDATE_GROUP_TOPIC_LAST_READ_POST,
    graphql: {
      query: `mutation($id: ID, $data: GroupTopicFollowInput) {
        updateGroupTopicFollow(id: $id, data: $data) {
          success
        }
      }`,
      variables: {
        id,
        data: {
          lastReadPostId
        }
      }
    },
    meta: { id, optimistic: true }
  }
}
