export default function presentGroup (group) {
  if (!group) return null

  return {
    ...group.ref,
    groupTopics: group.groupTopics ? group.groupTopics.toModelArray().map(groupTopic => {
      return {
        ...groupTopic.ref,
        name: groupTopic.topic.name
      }
    }) : [],
    joinQuestions: group.joinQuestions ? group.joinQuestions.toRefArray() : [],
    members: group.members ? group.members.toModelArray() : [],
    suggestedSkills: group.suggestedSkills ? group.suggestedSkills.toRefArray() : []
  }
}
