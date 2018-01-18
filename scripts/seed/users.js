/* global USER_COUNT, USER_COMMUNITY_CHANCE */

import faker from 'faker'
import { pick, times } from 'lodash/fp'

import backend from './api'
import { oneTo } from './util'

import { addSkill } from 'routes/Signup/AddSkills/AddSkills.store'
import { createCommunity } from 'routes/CreateCommunity/Review/Review.store'
import { updateUserSettings } from 'store/actions/updateUserSettings'

const fakeUser = () => {
  const community = faker.random.words()

  return {
    avatarUrl: faker.internet.avatar(),
    bannerUrl: faker.image.imageUrl(),
    bio: faker.lorem.paragraph(),
    community: { name: community, slug: faker.helpers.slugify(community) },

    // Faker's email function tends to duplicate in the 1000's, hence unique.
    email: faker.unique(faker.internet.email),

    facebookUrl: faker.internet.url(),
    linkedinUrl: faker.internet.url(),
    location: faker.address.country(),
    login: true,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    password: 'hylo',
    settings: { signupInProgress: false },
    skills: [ ...new Array(oneTo(5)) ].map(faker.hacker.ingverb),
    twitterName: faker.internet.userName(),
    work: faker.lorem.paragraph(),
    url: faker.internet.url()
  }
}

export default async function users (page) {
  process.stdout.write(`\n  Creating ${USER_COUNT} users...`)
  const api = backend(page)

  // At time of writing, /noo/user is essentially an unprotected POST route.
  // We're exploiting this here, but should probably change that... this bit
  // doesn't actually need admin login at all.
  const userBatch = [
    {
      name: 'Test User',
      community: { name: 'Test Community', slug: 'test-community' },
      email: 'test@hylo.com',
      login: true,
      password: 'hylo',
      settings: { signupInProgress: false }
    },
    ...times(fakeUser, USER_COUNT)
  ]

  for (let user of userBatch) {
    process.stdout.write('\n  Creating user and logging in, ')
    await api.request('/noo/user', user)

    process.stdout.write('faking their data, ')
    const fields = pick([
      'avatarUrl',
      'bannerUrl',
      'bio',
      'facebookUrl',
      'firstName',
      'linkedinUrl',
      'location',
      'settings',
      'twitterName',
      'url'
    ], user)
    const person = await api.graphql(updateUserSettings(fields))
    user.id = person.data.updateMe.id

    process.stdout.write('adding skills, ')
    for (let skill of user.skills || []) {
      await api.graphql(addSkill(skill))
    }

    if (Math.random() < USER_COMMUNITY_CHANCE || user.email.endsWith('@hylo.com')) {
      process.stdout.write('creating community, ')
      await api.graphql(createCommunity(user.community.name, user.community.slug))
    }

    process.stdout.write('and logging out.')
    await api.logout()
  }

  // Now we need to update the rest. Relevant files:
  //  - Signup/AddSkills/AddSkills.store
  //  - store/updateUserSettings
  // for (let user of userBatch) {
  //   const fields = pick([
  //     'avatarUrl',
  //     'bannerUrl',
  //     'bio',
  //     'extraInfo',
  //     'facebookUrl',
  //     'firstName',
  //     'intention',
  //     'linkedinUrl',
  //     'location',
  //     'twitterName',
  //     'work',
  //     'url'
  //   ], user)
  //   const encodedQuery = encodeUriComponent(updateUserSettings(
  //   query(
  // }
  //
  return userBatch
}
