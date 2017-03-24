export default function transform (post) {
  // Functions taking the value to modify as a single argument.
  // Note that most of these need to happen _after_ relations have already
  // been processed in `transformMiddleware`.
  const transforms = {
    creator: creator => creator.id,
    followers: followers => followers.map(f => f.id),
    communities: communities => communities.map(c => c.id),
    comments: comments => comments.map(c => c.id)
  }

  const transformedPost = {
    ...post
  }

  Object.keys(transforms).forEach(key => {
    if (post[key] !== undefined) {
      transformedPost[key] = transforms[key](post[key])
    }
  })

  return transformedPost
}
