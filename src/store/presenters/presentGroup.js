export default function presentGroup (group) {
  if (!group) return null

  return {
    ...group.ref,
    members: group.members ? group.members.toModelArray() : [],
    groupTopics: group.groupTopics ? group.groupTopics.toModelArray().map(groupTopic => {
      return {
        ...groupTopic.ref,
        name: groupTopic.topic.name
      }
    }) : [],
    joinQuestions: group.joinQuestions.toRefArray()
  }
}
