import presentTopic from 'store/presenters/presentTopic'

export default function presentPost (post, communityId) {
  if (!post) return null

  const postMembership = post.postMemberships.toRefArray().find(p =>
    Number(p.community) === Number(communityId))
  const pinned = postMembership && postMembership.pinned

  return {
    ...post.ref,
    creator: post.creator,
    linkPreview: post.linkPreview,
    location: post.location,
    isPublic: post.isPublic,
    commenters: post.commenters.toModelArray(),
    communities: post.communities.toModelArray(),
    attachments: post.attachments
      .orderBy('position').toModelArray(),
    fileAttachments: post.attachments
      .orderBy('position').filter(a => a.type === 'file').toModelArray(),
    pinned,
    topics: post.topics.toModelArray().map(topic => presentTopic(topic, {})),
    members: post.members.toModelArray().map(person => {
      return {
        ...person.ref,
        skills: person.skills.toRefArray()
      }
    }),
    eventInvitations: post.eventInvitations.toModelArray().map(eventInvitation => {
      return {
        response: eventInvitation.response,
        ...eventInvitation.person.ref
      }
    })
  }
}
