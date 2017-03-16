import React from 'react'
import PostCard from 'components/PostCard'

const rotateAndTrim = (arr, n) => arr.slice(n, arr.length).concat(arr.slice(0, n)).slice(0, 3)

const SAMPLE_AVATAR_URLS = [
  'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png',
  'https://d3ngex8q79bk55.cloudfront.net/user/21/avatar/1466554313506_EdwardHeadshot2016Square.jpg',
  'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/12144903_10153534724302626_8743195209403891032_n.jpg?oh=52acc29b654af537a39e3e1cc9db9ca3&oe=596B994F',
  'https://lh6.googleusercontent.com/-Yykp9BrS5pM/AAAAAAAAAAI/AAAAAAAAGFQ/45VGI9GhQCQ/photo.jpg'
]

const SAMPLE_IMAGE_URL = 'https://d3ngex8q79bk55.cloudfront.net/community/1944/banner/1489599795424_16820055642_cec4641527_z.jpg'

const SAMPLE_AUTHOR = {name: 'Sarah Pham', avatarUrl: SAMPLE_AVATAR_URLS[0]}

const SAMPLE_PEOPLE = [
  {name: 'Steph', avatarUrl: SAMPLE_AVATAR_URLS[0]},
  {name: 'Cam', avatarUrl: SAMPLE_AVATAR_URLS[1]},
  {name: 'Christy', avatarUrl: SAMPLE_AVATAR_URLS[2]},
  {name: 'Joe', avatarUrl: SAMPLE_AVATAR_URLS[3]}
]

const SAMPLE_POST = {
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  type: 'offer',
  voteCount: '2564',
  user: SAMPLE_AUTHOR,
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 0),
  commentCount: 60,
  updated_at: '6 hours ago'
}

const SAMPLE_POST_WITH_DESCRIPTION = {
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  description: 'Feel free to print and distribute or if you would like to suggest anything we have missed or better clarity, let us know!',
  type: 'offer',
  voteCount: '2564',
  user: SAMPLE_AUTHOR,
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 1),
  commentCount: 60,
  updated_at: '6 hours ago'
}

const SAMPLE_POST_WITH_IMAGE = {
  title: 'Three volunteers needed to collect signatures in East Van next weekend',
  type: 'request',
  imageUrl: SAMPLE_IMAGE_URL,
  voteCount: '2564',
  user: SAMPLE_AUTHOR,
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 2),
  commentCount: 60,
  updated_at: '6 hours ago'
}

const SAMPLE_POST_WITH_PREVIEW = {
  title: 'Stop Wombat Walrus',
  type: 'discussion',
  linkPreview: {
    title: 'Indigenous Canadians warn of increased conflicts in 2017',
    url: 'https://www.theguardian.com/technology/2017/mar/11/tim-berners-lee-web-inventor-save-internet',
    imageUrl: 'http://images.tate.org.uk/sites/default/files/images/picasso_pigeon_peas_0.jpg'
  },
  imageUrl: SAMPLE_IMAGE_URL,
  voteCount: '2564',
  user: SAMPLE_AUTHOR,
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 3),
  commentCount: 60,
  updated_at: '6 hours ago'
}

export default function PostTypes (props) {
  return <div>
    <div className='sheet'>
      <div className='sheet-title'>Post Types</div>
      <div styleName='postCards'>
        <PostCard post={SAMPLE_POST} styleName='postCard' />
        <PostCard post={SAMPLE_POST_WITH_IMAGE} styleName='postCard' />
        <PostCard post={SAMPLE_POST_WITH_DESCRIPTION} styleName='postCard' />
        <PostCard post={SAMPLE_POST_WITH_PREVIEW} styleName='postCard' />
      </div>
    </div>
  </div>
}
