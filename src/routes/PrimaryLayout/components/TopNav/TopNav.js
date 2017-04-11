import React from 'react'
import { bgImageStyle } from 'util/index'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import './TopNav.scss'
import Dropdown from 'components/Dropdown'
import { get } from 'lodash/fp'

export default function TopNav ({ community, currentUser, logout, toggleCommunitiesDrawer }) {
  const imageStyle = bgImageStyle(community.avatarUrl)
  return <div styleName='topNavWrapper'>
    <div styleName='topNav'>
      <span styleName='image' style={imageStyle} onClick={toggleCommunitiesDrawer} />
      <div styleName='title'>
        <div className='tag' styleName='label'>COMMUNITY</div>
        <div className='hdr-subheadline' styleName='communityName'>{community.name}</div>
      </div>
      <div styleName='navIcons'>
        <Link to='/' styleName='navIcon'><Icon name='Search' styleName='icon' /></Link>
        <Link to='/' styleName='navIcon'><Icon name='Messages' styleName='icon' /></Link>
        <Link to='/' styleName='navIcon'><Icon name='Notifications' styleName='icon' /></Link>
        <Dropdown styleName='navIcon dropdown' triangle
          toggleChildren={
            <RoundImage url={get('avatarUrl', currentUser)} small />
          }>
          <li><Link to='/'>Profile</Link></li>
          <li><Link to='/'>Settings</Link></li>
          <li><a onClick={logout}>Log out</a></li>
        </Dropdown>
      </div>
    </div>
  </div>
}
