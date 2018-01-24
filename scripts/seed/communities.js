/* global MEMBER_COUNT */

import { sampleSize } from 'lodash/fp'

import backend from './api'

export default async function seedCommunities (page, userBatch) {
  const api = backend(page)

  // Only use communities with an ID
  const communities = userBatch.reduce((acc, user) => {
    if (user.community.id) {
      return [ ...acc, user.community ]
    }
    return acc
  }, [])

  for (let community of communities) {
    process.stdout.write(`\n  Adding members to ${community.name}...`)
    const members = sampleSize(MEMBER_COUNT, userBatch)

    for (let member of members) {
      // Don't add if they're the owner
      if (community.id === member.community.id) continue

      // This one isn't in the front-end yet, exposed as an admin-only mutation
      // on the server.
      const mutation = {
        graphql: {
          query: `mutation { 
            addMemberToCommunity (personId: ${member.id}, communityId: ${community.id}) {
              community {
                id
              }
            }
          }`
        }
      }
      const membership = await api.graphql(mutation)
      if (!member.memberships) member.memberships = []
      member.memberships.push(membership.data.addMemberToCommunity.community.id)
    }
    process.stdout.write(' ✓')
  }

  // Don't let anyone through without being a member of at least one community:
  // if they don't have any, add 'em to the first one, usually test-community.
  userBatch
    .filter(u => !u.memberships)
    .forEach(u => { u.memberships = [ communities[0].id ] })
}
