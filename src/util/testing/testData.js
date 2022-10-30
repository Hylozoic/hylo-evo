import faker from '@faker-js/faker'
import { times } from 'lodash'

export function fakePerson (count = 1) {
  const data = times(count, () => ({
    id: faker.datatype.number(),
    name: faker.name.findName(),
    avatarUrl: faker.image.avatar() + '?' + faker.datatype.number(),
    tagline: faker.name.jobTitle()
  }))
  return count === 1 ? data[0] : data
}

export function fakePost () {
  return {
    id: 'FAKE_' + faker.datatype.number(),
    type: 'offer',
    title: 'We put this together as a PDF for hand-out at your next event or university class',
    context: 'Stop Wombat Walrus',
    details: 'Feel free to print and distribute if you would like to suggest anything we have missed or better clarity, let us know!',
    peopleReactedTotal: faker.datatype.number(),
    tags: ['activism', 'petition'],
    attachments: [{ url: 'animage', attachmentType: 'image' }],
    groups: [{ id: '1', slug: 'great', name: 'Great Cause' }],
    commenters: fakePerson(3),
    commentersTotal: faker.datatype.number(),
    creator: fakePerson()
  }
}

export const SAMPLE_IMAGE_URL = 'https://d3ngex8q79bk55.cloudfront.net/group/1944/banner/1489687099172_ggbridge.jpg'

export function fakeComment () {
  return {
    id: 'FAKE_' + faker.datatype.number(),
    creator: fakePerson(),
    createdAt: faker.date.recent().toString(),
    text: "Hey Steven! I live right next to there and can come help out. I've never done petitioning but I'm open to learn."
  }
}
