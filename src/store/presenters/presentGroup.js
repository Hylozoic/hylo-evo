export default function presentGroup (group, groupId) {
  if (!group) return null

  return {
    ...group.ref,
    visibility: group.visibility,
    accessibility: group.accessibility,
    settings: group.settings,
    members: group.members.toModelArray(),
    groupTopics: group.groupTopics.toModelArray().map(groupTopic => {
      return {
        ...groupTopic.ref,
        name: groupTopic.topic.name
      }
    })
  }
}
