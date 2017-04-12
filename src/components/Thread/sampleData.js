import { times } from 'lodash'
import faker from 'faker'

export default {
  id: '1',
  lastReadAt: '',

  messagesTotal: 100,
  participants: [
    {id: '1', name: 'Person 1'},
    {id: '3', name: 'Jane Smith'},
    {id: '2', name: 'Person 2'}
  ]
}

export const messages = [
  {
    id: '1',
    text: faker.lorem.sentence(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '2',
    text: times(3, () => faker.lorem.paragraph()).join(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '3',
    text: faker.lorem.sentence(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '4',
    text: faker.lorem.sentence(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '5',
    text: faker.lorem.sentence(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '6',
    text: faker.lorem.sentence(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '7',
    text: faker.lorem.sentence(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '8',
    text: times(3, () => faker.lorem.paragraph()).join(),
    creator: {
      id: '1',
      name: 'Person 1',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '9',
    text: faker.lorem.sentence(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '10',
    text: times(3, () => faker.lorem.paragraph()).join(),
    creator: {
      id: '2',
      name: 'Person 2',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  },
  {
    id: '11',
    text: times(5, () => faker.lorem.paragraph()).join(),
    creator: {
      id: '1',
      name: 'Person 1',
      avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
    },
    createdAt: new Date()
  }
]
