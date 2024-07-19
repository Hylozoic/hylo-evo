import { FETCH_TOPIC } from 'store/constants'

export default function fetchTopic (name, id) {
  return {
    type: FETCH_TOPIC,
    graphql: {
      query: `query ($name: String, $id: ID) {
        topic(name: $name, id: $id) {
          id
          name
          postsTotal
          followersTotal
        }
      }`,
      variables: {
        name,
        id
      }
    },
    meta: {
      extractModel: 'Topic'
    }
  }
}
