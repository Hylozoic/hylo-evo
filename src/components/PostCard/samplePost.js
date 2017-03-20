const SAMPLE_IMAGE_URL = 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'

const SAMPLE_AUTHOR = {name: 'Sarah Pham', avatarUrl: SAMPLE_IMAGE_URL}

const SAMPLE_PEOPLE = [
  {name: 'Steph', avatarUrl: SAMPLE_IMAGE_URL},
  {name: 'Cam', avatarUrl: SAMPLE_IMAGE_URL},
  {name: 'Christy', avatarUrl: SAMPLE_IMAGE_URL},
  {name: 'Sam', avatarUrl: SAMPLE_IMAGE_URL}
]

const SAMPLE_POST = {
  id: 'SAMPLE_POST',
  type: 'event',
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  body: 'Feel free to print and distribute if you would like to suggest anything we have missed or better clarity, let us know!',
  votesCount: '2564',
  tags: ['activism', 'petition'],
  commenters: SAMPLE_PEOPLE,
  author: SAMPLE_AUTHOR,
  upVoters: SAMPLE_PEOPLE
}

export default SAMPLE_POST
