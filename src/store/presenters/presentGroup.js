export default function presentGroup (group) {
  if (!group) return null
  return {
    ...group.ref,
    visibility: group.visibility,
    accessibility: group.accessibility,
    settings: group.settings,
    widgets: group.widgets ? group.widgets.toRefArray() : [],
    groupTopics: group.groupTopics ? group.groupTopics.toModelArray().map(groupTopic => {
      return {
        ...groupTopic.ref,
        name: groupTopic.topic.name
      }
    }) : [],
    joinQuestions: group.joinQuestions.toRefArray()
  }
}
