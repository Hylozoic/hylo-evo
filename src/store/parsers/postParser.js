// Must be present for a valid model
const required = [
  'id',
  'title',
  'details',
  'type'
]

// Add unaltered. If a property name isn't listed in either `passThrough` or
// `transform`, it won't be in the store.
const passThrough = [
  'id',
  'title',
  'details',
  'type',
  'creator',
  'followersTotal',
  'communitiesTotal',
  'commentsTotal',
  'createdAt',
  'startsAt',
  'endsAt',
  'fulfilledAt'
]

// Functions taking the value to modify as a single argument.
// Note that most of these need to happen _after_ relations have already
// been processed in `parserMiddleware`.
const transform = {
  creator: creator => creator.id,
  followers: followers => followers.map(f => f.id),
  communities: communities => communities.map(c => c.id),
  comments: comments => comments.map(c => c.id)
}

// All validators will be run with the post to check as a single argument.
const validate = {
  hasRequiredProperties (post) {
    return required.find(p => !post.hasOwnProperty(p)) ? false : true
  }
}

export function normalize (post) {
  const parsedPost = {}

  passThrough.forEach(key => {
    if (post[key] !== undefined) {
      parsedPost[key] = post[key]
    }
  })
  Object.keys(transform).forEach(key => {
    if (post[key] !== undefined) {
      parsedPost[key] = transform[key](post[key])
    }
  })

  return parsedPost
}

const parser = {
  isValid (post) {
    const validatorResults = Object.keys(validate)
      .map(key => validate[key](post))

    return !validatorResults.includes(false)
  },

  parse (post) {
    return normalize(post)
  }
}

export default parser
