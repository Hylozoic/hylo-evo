import React, { Component } from 'react'
import { bgImageStyle, personUrl } from 'util/index'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import BadgedIcon from 'components/BadgedIcon'
import RoundImage from 'components/RoundImage'
import './TopNav.scss'
import Dropdown from 'components/Dropdown'
import { get } from 'lodash/fp'
import { hyloLogo } from 'util/assets'
import MessagesDropdown from './MessagesDropdown'
import NotificationsDropdown from './NotificationsDropdown'
import { position } from 'util/scrolling'

export default class TopNav extends Component {
  componentDidMount () {
    const { topNav } = this.refs
    const height = topNav.clientHeight
    const width = topNav.clientWidth
    const { x } = position(topNav)
    this.props.setTopNavPosition({height, rightX: x + width})
  }

  render () {
    const { className, community, currentUser, logout, toggleDrawer } = this.props
    const profileUrl = personUrl(get('id', currentUser), get('slug', community))

    return <div styleName='topNavWrapper' className={className}>
      <div styleName='topNav' ref='topNav'>
        <Logo {...{community, toggleDrawer}} />
        <Title community={community} />
        <div styleName='navIcons'>
          <Link to='/'><Icon name='Search' styleName='icon' /></Link>
          <MessagesDropdown renderToggleChildren={showBadge =>
            <BadgedIcon name='Messages' styleName='icon'
              showBadge={showBadge} />} />
          <NotificationsDropdown renderToggleChildren={showBadge =>
            <BadgedIcon name='Notifications' styleName='icon'
              showBadge={showBadge} />} />
          <Dropdown styleName='user-menu' alignRight
            toggleChildren={
              <RoundImage url={get('avatarUrl', currentUser)} small />
            }>
            <li>
              <Link to={profileUrl}>
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
