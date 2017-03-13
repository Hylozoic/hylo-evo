import React from 'react'
import { bgImageStyle } from 'utils'

const SAMPLE_COMMUNITY = {
  name: 'Generic Cause',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/avatar/1489438401225_face.png'
}

export default function TopNav ({ community = SAMPLE_COMMUNITY }) {
  const imageStyle = bgImageStyle(community.avatarUrl)
  return <div styleName='topNav'>
    <span styleName='image' style={imageStyle} />
    <div styleName='title'>
      <div className='tag' styleName='label'>COMMUNITY</div>
      <div className='hdr-subheadline' styleName='communityName'>{community.name}</div>
    </div>
  </div>
}
