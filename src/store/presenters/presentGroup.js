export default function presentGroup (group) {
  if (!group) return null
  return {
    ...group.ref,
    announcements: group.announcements ? group.announcements.toModelArray().map(a => {
      return {
        ...a.ref,
        author: a.creator.name,
        primaryImage: a.attachments.length > 0 ? a.attachments[0].url : false
      }
    }) : [],
    groupTopics: group.groupTopics ? group.groupTopics.toModelArray().map(groupTopic => {
      return {
        ...groupTopic.ref,
        name: groupTopic.topic.name
      }
    }) : [],
    joinQuestions: group.joinQuestions.toRefArray(),
    members: group.members ? group.members.toModelArray() : [],
    widgets: group.widgets ? group.widgets.toRefArray() : []
  }
}
