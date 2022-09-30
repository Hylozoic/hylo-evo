import presentPost from 'store/presenters/presentPost'

export default function presentCollection (collection) {
  if (!collection) return null

  return {
    ...collection.ref,
    posts: collection.posts.toModelArray().map(p => presentPost(p))
  }
}
