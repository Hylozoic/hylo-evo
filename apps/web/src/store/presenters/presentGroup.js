import presentCollection from 'store/presenters/presentCollection'
import presentTopic from 'store/presenters/presentTopic'

export default function presentGroup (group) {
  if (!group) return null
  return {
    ...group.ref,
    activeProjects: group.activeProjects
      ? group.activeProjects.toModelArray().map(p => {
        return {
          ...p.ref,
          creator: p.creator.ref
        }
      })
      : [],
    agreements: group.agreements
      ? group.agreements.toModelArray().map(a => {
        return {
          ...a.ref
        }
      }).sort((a, b) => a.order - b.order)
      : [],
    announcements: group.announcements
      ? group.announcements.toModelArray().map(a => {
        return {
          ...a.ref,
          author: a.creator.name,
          primaryImage: a.attachments.length > 0 ? a.attachments[0].url : false
        }
      })
      : [],
    customViews: group.customViews
      ? group.customViews.toModelArray().map(cv => {
        return {
          ...cv.ref,
          collection: cv.collection ? presentCollection(cv.collection) : null,
          topics: cv.topics.toModelArray().map(topic => presentTopic(topic, {}))
        }
      })
      : [],
    groupToGroupJoinQuestions: group.groupToGroupJoinQuestions ? group.groupToGroupJoinQuestions.toRefArray() : [],
    groupTopics: group.groupTopics
      ? group.groupTopics.toModelArray().map(groupTopic => {
        return {
          ...groupTopic.ref,
          name: groupTopic.topic.name
        }
      })
      : [],
    joinQuestions: group.joinQuestions ? group.joinQuestions.toRefArray() : [],
    members: group.members ? group.members.toModelArray() : [],
    openOffersAndRequests: group.openOffersAndRequests
      ? group.openOffersAndRequests.toModelArray().map(p => {
        return {
          ...p.ref,
          creator: p.creator.ref
        }
      })
      : [],
    prerequisiteGroups: group.prerequisiteGroups
      ? group.prerequisiteGroups.toModelArray().map(prereq => {
        return {
          ...prereq.ref,
          joinQuestions: prereq.joinQuestions ? prereq.joinQuestions.toModelArray() : []
        }
      })
      : [],
    stewards: group.stewards ? group.stewards.toModelArray() : [],
    suggestedSkills: group.suggestedSkills ? group.suggestedSkills.toRefArray() : [],
    upcomingEvents: group.upcomingEvents
      ? group.upcomingEvents.toModelArray().map(p => {
        return {
          ...p.ref,
          primaryImage: p.attachments.length > 0 ? p.attachments[0].url : false
        }
      })
      : [],
    widgets: group.widgets ? group.widgets.toRefArray() : []
  }
}
