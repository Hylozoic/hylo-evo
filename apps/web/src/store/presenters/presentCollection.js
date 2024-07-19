import presentPost from 'store/presenters/presentPost'

export default function presentCollection (collection) {
  if (!collection) return null

  const linkedPosts = collection.linkedPosts.toModelArray()
  return {
    ...collection.ref,
    posts: linkedPosts.length > 0 ? linkedPosts.map(lp => presentPost(lp.post)) : collection.posts.toModelArray().map(p => presentPost(p))
  }
}
