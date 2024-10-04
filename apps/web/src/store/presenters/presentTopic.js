export default function presentTopic (topic) {
  if (!topic) return null

  return {
    ...topic.ref,
    label: topic.name,
    value: topic.name,
    groupTopics: topic.groupTopics.toModelArray()
  }
}
