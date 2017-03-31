import React from 'react'
import { bgImageStyle } from 'util/index'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import './component.scss'
import Dropdown from 'components/Dropdown'

export default function TopNav ({ community, currentUser, logout }) {
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
      <Dropdown styleName='navIcon dropdown' triangle
        toggleChildren={<RoundImage url={currentUser.avatarUrl} small />}>
        <li><Link to='/'>Profile</Link></li>
        <li><Link to='/'>Settings</Link></li>
        <li><a onClick={logout}>Log out</a></li>
      </Dropdown>
    </div>
  </div>
}
