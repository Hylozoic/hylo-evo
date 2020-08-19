export default function presentComment (comment, communitySlug = undefined) {
  if (!comment || !comment.post) return
  return {
    ...comment.ref,
    creator: comment.creator.ref,
    post: comment.post.ref,
    attachments: comment.attachments
      .orderBy('position').toModelArray(),
    slug: communitySlug
  }
}
