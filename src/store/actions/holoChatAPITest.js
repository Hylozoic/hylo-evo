// can remove this once holochat integration is complete
export default function holoChatAPITest () {
  return {
    type: 'HOLO_CHAT_API_TEST',
    graphql: {
      query: `query { apiVersion }`
    },
    meta: {
      holoChatAPI: true
    }
  }
}
