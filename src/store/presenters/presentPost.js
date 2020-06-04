export default function presentPost (post, communityId) {
  if (!post) return null
  const postMembership = post.postMemberships.filter(p =>
    Number(p.community) === Number(communityId)).toRefArray()[0]
  const pinned = postMembership && postMembership.pinned

  let communities = post.communities.toRefArray()
  if (post.isPublic) {
    communities.unshift({ name: 'Public', id: 'public', avatarUrl: '/public-icon.svg', slug: '/all' })
  }

  return {
    ...post.ref,
    creator: post.creator,
    linkPreview: post.linkPreview,
    location: post.location,
    isPublic: post.isPublic,
    commenters: post.commenters.toModelArray(),
    communities: post.communities.toModelArray(),
    communitiesArray: communities,
    fileAttachments: post.attachments.filter(a => a.type === 'file').toModelArray(),
    pinned,
    topics: post.topics.toModelArray(),
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
