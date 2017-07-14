import React, { Component } from 'react'
import { bgImageStyle, personUrl } from 'util/index'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import RoundImage from 'components/RoundImage'
import './TopNav.scss'
import Dropdown from 'components/Dropdown'
import { get } from 'lodash/fp'
import { throttle } from 'lodash'
import { hyloLogo } from 'util/assets'
import MessagesDropdown from './MessagesDropdown'
import NotificationsDropdown from './NotificationsDropdown'
import { position } from 'util/scrolling'

export default class TopNav extends Component {
  componentDidMount () {
    const setTopNavPosition = () => {
      const { topNav } = this.refs
      const height = topNav.clientHeight
      const width = topNav.clientWidth
      const { x } = position(topNav)
      this.props.setTopNavPosition({height, rightX: x + width})
    }
    setTopNavPosition()
    window.addEventListener('resize', throttle(setTopNavPosition, 300, {trailing: true}))
  }

  render () {
    const { className, community, network, currentUser, logout, toggleDrawer, showLogoBadge } = this.props
    const profileUrl = personUrl(get('id', currentUser), get('slug', community))

    return <div styleName='topNavWrapper' className={className}>
      <div styleName='topNav' ref='topNav'>
        <Logo {...{communityOrNetwork: community || network, toggleDrawer, showLogoBadge}} />
        <Title community={community} network={network} />
        <div styleName='navIcons'>
          <Link to='/search'><Icon name='Search' styleName='icon' /></Link>
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

function Logo ({ communityOrNetwork, toggleDrawer, showLogoBadge }) {
  const imageStyle = bgImageStyle(get('avatarUrl', communityOrNetwork) || hyloLogo)
  return <span styleName='image' style={imageStyle}
    onClick={toggleDrawer}>
    {showLogoBadge && <Badge number='1' styleName='logoBadge' border />}
  </span>
}

function Title ({ community, network }) {
  var [ label, name ] = ['GLOBAL', 'All Communities']
  if (community) {
    [ label, name ] = ['COMMUNITY', community.name]
  } else if (network) {
    [ label, name ] = ['NETWORK', network.name]
  }

  return <div styleName='title'>
    <div styleName='label'>
      {label}
    </div>
    <div styleName='communityName'>{name}</div>
  </div>
}
