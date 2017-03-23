import faker from 'faker'
import { times } from 'lodash'

function fakePerson () {
  return {
    name: faker.name.findName(),
    avatarUrl: faker.image.avatar()
  }
}

const SAMPLE_POST = {
  id: 'SAMPLE_POST',
  type: 'event',
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  body: 'Feel free to print and distribute if you would like to suggest anything we have missed or better clarity, let us know!',
  votesCount: '2564',
  tags: ['activism', 'petition'],
  commenters: times(3, fakePerson),
  author: fakePerson(),
  upVoters: times(5, fakePerson)
}

export default SAMPLE_POST
