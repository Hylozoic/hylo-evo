import React from 'react'
import { bgImageStyle } from 'util/index'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import styles from './component.scss' // eslint-disable-line no-unused-vars

const SAMPLE_COMMUNITY = {
  name: 'Generic Cause',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/avatar/1489438401225_face.png'
}

const SAMPLE_USER = {
  id: '1',
  name: 'Axolotl',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
}

export default function TopNav ({ community = SAMPLE_COMMUNITY }) {
  const imageStyle = bgImageStyle(community.avatarUrl)
  return <div styleName='topNav'>
    <span styleName='image' style={imageStyle} />
    <div styleName='title'>
      <div className='tag' styleName='label'>COMMUNITY</div>
      <div className='hdr-subheadline' styleName='communityName'>{community.name}</div>
    </div>
    <div styleName='navIcons'>
      <Link to='/' styleName='navIcon'><Icon name='Search' styleName='icon' /></Link>
      <Link to='/' styleName='navIcon'><Icon name='Messages' styleName='icon' /></Link>
      <Link to='/' styleName='navIcon'><Icon name='Notifications' styleName='icon' /></Link>
      <Link to='/' styleName='navIcon'><RoundImage url={SAMPLE_USER.avatarUrl} small /></Link>
    </div>
  </div>
}
