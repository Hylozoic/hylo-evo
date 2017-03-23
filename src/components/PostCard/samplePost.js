import faker from 'faker'
import { times } from 'lodash'

export function fakePerson (count = 1) {
  const data = times(count, () => ({
    id: faker.random.number(),
    name: faker.name.findName(),
    avatarUrl: faker.image.avatar() + '?' + faker.random.number()
  }))
  return count === 1 ? data[0] : data
}

const SAMPLE_POST = {
  id: 'SAMPLE_POST',
  type: 'offer',
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  body: 'Feel free to print and distribute if you would like to suggest anything we have missed or better clarity, let us know!',
  votesCount: '2564',
  tags: ['activism', 'petition'],
  commenters: fakePerson(3),
  commentersTotal: Math.round(Math.random() * 100),
  author: fakePerson(),
  upVoters: fakePerson(5)
}

export default SAMPLE_POST
