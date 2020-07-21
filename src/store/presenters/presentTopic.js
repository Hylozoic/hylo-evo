export default function presentTopic (topic, { networkSlug }) {
  if (!topic) return null

  return {
    ...topic.ref,
    label: topic.name,
    value: topic.name,
    communityTopics: networkSlug
      ? topic.communityTopics.toModelArray().filter(t =>
        t.community.network && t.community.network.slug === networkSlug)
      : topic.communityTopics.toModelArray()
  }
}
