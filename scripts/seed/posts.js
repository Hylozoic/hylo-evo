/* global POST_COUNT */
import faker from 'faker'

import backend from './api'
import { createPost } from 'components/PostEditor/PostEditor.store'

export default async function seedPosts (page, userBatch) {
  const api = backend(page)

  // Only use communities with an ID
  const communities = userBatch.reduce((acc, user) => {
    if (user.community.id) {
      return [ ...acc, user.community ]
    }
    return acc
  }, [])

  const posts = []
  for (let community of communities) {
    process.stdout.write(`\n  Adding posts to ${community.name}...`)
    const members = userBatch.reduce((acc, user) => {
      if (user.memberships.includes(community.id) || user.community.id === community.id) {
        return [ ...acc, user ]
      }
      return acc
    }, [])

    // This is slow, with a lot of logging in and out, but it means no two posts
    // from each user are adjacent. Shame there's no easy way to fake the
    // timestamps though...
    for (let i = 0; i < POST_COUNT; i++) {
      for (let member of members) {
        // Let the login dance begin!
        await api.request('/noo/login', member)
        const post = await api.graphql(createPost({
          type: 'discussion',
          title: faker.lorem.sentence(),
          details: faker.lorem.paragraph(),
          communities: [ community ]
        }))
        posts.push(post)
        await api.logout()
      }
    }

    process.stdout.write(' ✓')
  }

  return posts
}
