export default function presentComment (comment, communitySlug = undefined) {
  if (!comment || !comment.post) return
  return {
    ...comment.ref,
    creator: comment.creator.ref,
    post: comment.post.ref,
    image: comment.attachments.toModelArray()[0],
    slug: communitySlug
  }
}

