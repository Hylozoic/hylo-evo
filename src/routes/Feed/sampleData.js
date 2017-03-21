import { times } from 'lodash/fp'
import faker from 'faker'

faker.seed(2)

const AVATAR_URLS = [
  'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png',
  'https://d3ngex8q79bk55.cloudfront.net/user/21/avatar/1466554313506_EdwardHeadshot2016Square.jpg',
  'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/12144903_10153534724302626_8743195209403891032_n.jpg?oh=52acc29b654af537a39e3e1cc9db9ca3&oe=596B994F',
  'https://lh6.googleusercontent.com/-Yykp9BrS5pM/AAAAAAAAAAI/AAAAAAAAGFQ/45VGI9GhQCQ/photo.jpg',
  'https://d3ngex8q79bk55.cloudfront.net/user/11204/avatar/1467755857845_a14145223586391656938.jpeg',
  'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15672781_10212062146577383_6810016017521000794_n.jpg?oh=785b5705b4bbdbf181281c32ac071b94&oe=59719AA8',
  'https://d3ngex8q79bk55.cloudfront.net/user/22955/avatar/1480359365475_14980847_10157678764370321_5228353041614811268_n.jpg',
  'https://d3ngex8q79bk55.cloudfront.net/user/42/avatar/1476899940076_prisma-japanese-paper.jpg'
]

const IMAGES = [
  'https://s-media-cache-ak0.pinimg.com/236x/3a/6c/44/3a6c44d440a12d5e3f04174e0156a478.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/ea/1b/0f/ea1b0f19b80647d23fde2a245b35806b.jpg',
  'http://static.boredpanda.com/blog/wp-content/uploads/2015/01/brothers-grimm-wanderings-landscape-photography-kilian-schonberger-3.jpg',
  'https://i.ytimg.com/vi/c7oV1T2j5mc/maxresdefault.jpg',
  'http://lorempixel.com/640/480/nature/2/',
  'http://lorempixel.com/640/480/nature/3/',
  'http://lorempixel.com/640/480/nature/4/',
  'http://lorempixel.com/640/480/nature/5/',
  'http://lorempixel.com/640/480/nature/6/',
  'http://lorempixel.com/640/480/nature/7/'
]

const rndAvatarUrl = () => faker.random.arrayElement(AVATAR_URLS)

const rndImage = () => faker.random.arrayElement(IMAGES)

const rndType = () => faker.random.arrayElement(['offer', 'request', 'discussion'])

const maybe = value => faker.random.boolean() ? value : null

const rndPerson = () => ({
  id: faker.random.number(),
  name: faker.name.findName(),
  title: maybe(`${faker.name.jobArea()} ${faker.name.jobType()}`),
  avatarUrl: rndAvatarUrl()
})

const rndPreview = () => ({
  title: faker.lorem.sentence(),
  url: faker.internet.url(),
  imageUrl: rndImage()
})

const SAMPLE_FEED_ITEMS = times(i => ({
  id: i,
  title: faker.lorem.sentence(),
  type: rndType(),
  context: maybe(faker.lorem.words(faker.random.number(3))),
  voteCount: faker.random.number(),
  user: rndPerson(),
  commenters: times(rndPerson, 3),
  commentCount: faker.random.number(500),
  imageUrl: maybe(maybe(rndImage())),
  updated_at: (maybe(faker.date.recent()) || faker.date.past()).toString(),
  description: maybe(faker.lorem.sentences(faker.random.number(10))),
  linkPreview: maybe(maybe(rndPreview()))
}), 20)

const SAMPLE_COMMUNITY = {
  name: 'A Great Cause',
  location: 'Oakland, CA',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/avatar/1489438401225_face.png',
  bannerUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/banner/1489687099172_ggbridge.jpg'
}

export { SAMPLE_FEED_ITEMS, SAMPLE_COMMUNITY }
