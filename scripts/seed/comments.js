/* global COMMENT_COUNT */
import faker from 'faker'

import backend from './api'
import { createComment } from 'routes/PostDetail/Comments/Comment/Comment.store'

export default async function seedComments (page, userBatch, postBatch) {
  const api = backend(page)

  const communities = userBatch.reduce((acc, user) => {
    if (user.community.id) {
      return [ ...acc, user.community ]
    }
    return acc
  }, [])

  for (let community of communities) {
    const posts = postBatch.filter(p => {
      console.log(p.communities)
      return true
    })
    // process.stdout.write(`\n  Adding posts to ${community.name}...`)
    // const members = userBatch.reduce((acc, user) => {
    //   if (user.memberships.includes(community.id) || user.community.id === community.id) {
    //     return [ ...acc, user ]
    //   }
    //   return acc
    // }, [])
    //
    // // This is slow, with a lot of logging in and out, but it means no two posts
    // // from each user are adjacent. Shame there's no easy way to fake the
    // // timestamps though...
    // for (let i = 0; i < POST_COUNT; i++) {
    //   for (let member of members) {
    //     // Let the login dance begin!
    //     await api.request('/noo/login', member)
    //     const post = await api.graphql(createPost({
    //       type: 'discussion',
    //       title: faker.lorem.sentence(),
    //       details: faker.lorem.paragraph(),
    //       communities: [ community ]
    //     }))
    //     posts.push(post)
    //     await api.logout()
    //   }
    // }
    //
    // process.stdout.write(' ✓')
  }

  return null
}
