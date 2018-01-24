/* global COMMENT_COUNT */
import faker from 'faker'

import backend from './api'
import { createComment } from 'routes/PostDetail/Comments/Comments.store'

export default async function seedComments (page, userBatch, postBatch) {
  const api = backend(page)

  const communities = userBatch.reduce((acc, user) => {
    if (user.community.id) {
      return [ ...acc, user.community ]
    }
    return acc
  }, [])

  for (let community of communities) {
    const posts = postBatch.filter(p => p.data.createPost.communities[0].id === community.id)
    process.stdout.write(`\n  Adding comments to ${posts.length} posts in ${community.name}...`)
    const members = userBatch.reduce((acc, user) => {
      if (user.memberships.includes(community.id) || user.community.id === community.id) {
        return [ ...acc, user ]
      }
      return acc
    }, [])

    for (let i = 0; i < COMMENT_COUNT; i++) {
      for (let member of members) {
        await api.request('/noo/login', member)
        for (let post of posts) {
          await api.graphql(createComment(post.data.createPost.id, faker.lorem.paragraph()))
        }
        await api.logout()
      }
    }

    process.stdout.write(' ✓')
  }

  return null
}
