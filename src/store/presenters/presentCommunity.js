export default function presentCommunity (community, communityId) {
  if (!community) return null

  return {
    ...community.ref,
    isPublic: community.isPublic,
    isAutoJoinable: community.isAutoJoinable,
    publicMemberDirectory: community.publicMemberDirectory,
    members: community.members.toModelArray(),
    communityTopics: community.communityTopics.toModelArray().map(communityTopic => {
      return {
        ...communityTopic.ref,
        name: communityTopic.topic.name
      }
    })
  }
}
