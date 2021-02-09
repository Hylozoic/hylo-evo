export default function presentGroup (group, groupId) {
  if (!group) return null
  console.log('presentGroup ==>', group)
  return {
    ...group.ref,
    visibility: group.visibility,
    accessibility: group.accessibility,
    settings: group.settings,
    members: group.members.toModelArray(),
    widgets: group.widgets.toModelArray().map(widget => {
      return {...widget.ref}
    }),
    groupTopics: group.groupTopics.toModelArray().map(groupTopic => {
      return {
        ...groupTopic.ref,
        name: groupTopic.topic.name
      }
    })
  }
}
