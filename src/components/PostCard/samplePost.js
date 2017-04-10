import faker from 'faker'
import { times } from 'lodash'

export function fakePerson (count = 1) {
  const data = times(count, () => ({
    id: faker.random.number(),
    name: faker.name.findName(),
    avatarUrl: faker.image.avatar() + '?' + faker.random.number(),
    tagline: faker.name.jobTitle()
  }))
  return count === 1 ? data[0] : data
}

export default function samplePost () {
  return {
    id: 'FAKE_' + Math.round(Math.random() * 10000),
    type: 'offer',
    title: 'We put this together as a PDF for hand-out at your next event or university class',
    context: 'Stop Wombat Walrus',
    details: 'Feel free to print and distribute if you would like to suggest anything we have missed or better clarity, let us know!',
    votesTotal: Math.round(Math.random() * 1000),
    tags: ['activism', 'petition'],
    commenters: fakePerson(3),
    commentersTotal: Math.round(Math.random() * 100),
    creator: fakePerson(),
    updatedAt: faker.date.recent().toString()
  }
}
