import React from 'react'
import { bgImageStyle, personUrl } from 'util/index'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import './TopNav.scss'
import Dropdown from 'components/Dropdown'
import { get } from 'lodash/fp'
import { hyloLogo } from 'util/assets'

export default function TopNav ({ className, community, currentUser, logout, toggleDrawer }) {
  return <div styleName='topNavWrapper' className={className}>
    <div styleName='topNav'>
      <Logo {...{community, toggleDrawer}} />
      <Title community={community} />
      <div styleName='navIcons'>
        <Link to='/' styleName='navIcon'><Icon name='Search' styleName='icon' /></Link>
        <Link to='/t' styleName='navIcon'><Icon name='Messages' styleName='icon' /></Link>
        <Link to='/' styleName='navIcon'><Icon name='Notifications' styleName='icon' /></Link>
        <Dropdown styleName='navIcon user-menu' triangle alignRight
          toggleChildren={
            <RoundImage url={get('avatarUrl', currentUser)} small />
          }>
          <li>
            <Link to={personUrl(get('id', currentUser), get('slug', community))}>
              Profile
            </Link>
          </li>
          <li><Link to='/settings'>Settings</Link></li>
          <li><a onClick={logout}>Log out</a></li>
        </Dropdown>
      </div>
    </div>
  </div>
}

function Logo ({ community, toggleDrawer }) {
  const imageStyle = bgImageStyle(get('avatarUrl', community) || hyloLogo)
  return <span styleName='image' style={imageStyle}
    onClick={toggleDrawer} />
}

function Title ({ community }) {
  const [ label, name ] = community
    ? ['COMMUNITY', community.name]
    : ['GLOBAL', 'All Communities']

  return <div styleName='title'>
    <div styleName='label'>{label}</div>
    <div styleName='communityName'>{name}</div>
  </div>
}
