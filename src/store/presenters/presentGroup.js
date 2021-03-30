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
    joinQuestions: group.joinQuestions.toRefArray(),
    prerequisiteGroups: group.prerequisiteGroups ? group.prerequisiteGroups.toModelArray().map(prereq => {
      return {
        ...prereq.ref,
        joinQuestions: prereq.joinQuestions ? prereq.joinQuestions.toModelArray() : [],
        prerequisiteGroups: prereq.prerequisiteGroups ? prereq.prerequisiteGroups.toModelArray() : []
      }
    }) : []
  }
}
