import React from 'react'
import PostCard from 'components/PostCard'
import ShareButton from 'components/PostCard/ShareButton'
import { omit } from 'lodash/fp'
import Dropdown from 'components/Dropdown'
import Dropdown2 from 'components/Dropdown2'

const Dropdownf = ({ toggleChildren }) => toggleChildren

const rotateAndTrim = (arr, n) => arr.slice(n, arr.length).concat(arr.slice(0, n)).slice(0, 3)

const SAMPLE_AVATAR_URLS = [
  'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png',
  'https://d3ngex8q79bk55.cloudfront.net/user/21/avatar/1466554313506_EdwardHeadshot2016Square.jpg',
  'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/12144903_10153534724302626_8743195209403891032_n.jpg?oh=52acc29b654af537a39e3e1cc9db9ca3&oe=596B994F',
  'https://lh6.googleusercontent.com/-Yykp9BrS5pM/AAAAAAAAAAI/AAAAAAAAGFQ/45VGI9GhQCQ/photo.jpg'
]

const SAMPLE_IMAGE_URL = 'https://d3ngex8q79bk55.cloudfront.net/community/1944/banner/1489687099172_ggbridge.jpg'

const SAMPLE_AUTHOR = {
  name: 'Sarah Pham', avatarUrl: SAMPLE_AVATAR_URLS[0], title: 'Environmental Specialist'
}

const SAMPLE_PEOPLE = [
  {name: 'Steph', avatarUrl: SAMPLE_AVATAR_URLS[0]},
  {name: 'Cam', avatarUrl: SAMPLE_AVATAR_URLS[1]},
  {name: 'Christy', avatarUrl: SAMPLE_AVATAR_URLS[2]},
  {name: 'Joe', avatarUrl: SAMPLE_AVATAR_URLS[3]}
]

const SAMPLE_POST = {
  id: '1',
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  type: 'offer',
  context: 'Stop Wombat Walrus',
  voteCount: '2564',
  author: SAMPLE_AUTHOR,
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 0),
  commentersTotal: 60,
  updated_at: '6 hours ago'
}

const SAMPLE_POST_WITH_DESCRIPTION = {
  id: '2',
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  description: 'Feel free to print and distribute or if you would like to suggest anything we have missed or better clarity, let us know!',
  type: 'offer',
  voteCount: '2564',
  author: SAMPLE_AUTHOR,
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 1),
  commentersTotal: 60,
  updated_at: '6 hours ago'
}

const SAMPLE_POST_WITH_LONG_DESCRIPTION = {
  id: '3',
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  description: 'Feel free to print and distribute or if you would like to suggest anything we have missed or better clarity, let us know! Feel free to print and distribute or if you would like to suggest anything we have missed or better clarity, let us know!',
  type: 'offer',
  voteCount: '2564',
  author: SAMPLE_AUTHOR,
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 1),
  commentersTotal: 60,
  updated_at: '6 hours ago'
}

const SAMPLE_POST_WITH_IMAGE = {
  id: '4',
  title: 'Three volunteers needed to collect signatures in East Van next weekend',
  type: 'request',
  context: 'Stop Wombat Walrus',
  imageUrl: SAMPLE_IMAGE_URL,
  voteCount: '2564',
  author: omit('title', SAMPLE_AUTHOR),
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 2),
  commentersTotal: 60,
  updated_at: '6 hours ago'
}

const SAMPLE_POST_WITH_PREVIEW = {
  id: '5',
  title: 'Stop Wombat Walrus',
  type: 'discussion',
  linkPreview: {
    title: 'Indigenous Canadians warn of increased conflicts in 2017',
    url: 'https://www.theguardian.com/technology/2017/mar/11/tim-berners-lee-web-inventor-save-internet',
    imageUrl: 'http://images.tate.org.uk/sites/default/files/images/picasso_pigeon_peas_0.jpg'
  },
  voteCount: '2564',
  author: SAMPLE_AUTHOR,
  commenters: rotateAndTrim(SAMPLE_PEOPLE, 3),
  commentersTotal: 60,
  updated_at: '6 hours ago'
}

export default function PostTypes (props) {
  return <div>
    <div className='sheet'>
      <div className='sheet-title'>Post Types</div>
      <div styleName='postCards'>
        <PostCard post={SAMPLE_POST} styleName='postCard' Dd={Dropdownf} />
        <PostCard post={SAMPLE_POST_WITH_IMAGE} styleName='postCard' Dd={Dropdownf} />
        <PostCard post={SAMPLE_POST_WITH_DESCRIPTION} styleName='postCard' Dd={Dropdownf} />
        <PostCard post={SAMPLE_POST_WITH_LONG_DESCRIPTION} styleName='postCard' Dd={Dropdown} />
        <PostCard post={SAMPLE_POST_WITH_PREVIEW} styleName='postCard' Dd={Dropdown2} />
        <div><ShareButton post={SAMPLE_POST} /></div>
      </div>
    </div>
  </div>
}
