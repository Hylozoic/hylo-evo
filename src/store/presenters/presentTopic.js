export default function presentPost (topic, { communityId, networkId }) {
  if (!topic) return null

  return {
    ...topic.ref,
    communityTopics: networkId
    ? topic.communityTopics.toModelArray().filter(t =>
        t.community.network && Number(t.community.network.id) === Number(networkId)
      )
    : []
  }
}
