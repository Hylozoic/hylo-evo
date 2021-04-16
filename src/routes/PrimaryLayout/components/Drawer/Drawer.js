import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import { contextSwitchingUrl, groupUrl } from 'util/navigation'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import s from './Drawer.scss' // eslint-disable-line no-unused-vars
import { DEFAULT_AVATAR } from 'store/models/Group'
import cx from 'classnames'

const { string, number, arrayOf, shape } = PropTypes

export default class Drawer extends React.PureComponent {
  static propTypes = {
    groups: arrayOf(shape({
      id: string,
      newPostCount: number,
      name: string,
      slug: string,
      avatarUrl: string
    }))
  }

  render () {
    const { currentLocation, group, groups, defaultContexts, className, toggleDrawer, canModerate } = this.props
    const routeParams = this.props.match.params

    let bannerUrl

    if (!group) {
      bannerUrl = ''
    } else {
      ({ bannerUrl } = group)
    }

    return <div className={className} styleName='s.groupDrawer'>
      <div styleName={cx('drawerHeader', { 's.currentGroup': group !== null })} style={bgImageStyle(bannerUrl)}>
        <div styleName='drawerBanner'>
          <div styleName='s.hyloLogoBar'>
            <img src='/hylo.svg' width='50px' />
            <Icon name='Ex' styleName='s.closeDrawer' onClick={toggleDrawer} />
          </div>
          <Logo group={group} />
          {canModerate && <Link styleName='s.settingsLink' to={groupUrl(group.slug, 'settings')}>
            <Icon name='Settings' styleName='s.settingsIcon' /> Group Settings
          </Link>}
        </div>
        <div styleName='backgroundFade' />
      </div>
      <div>
        <ul styleName='s.groupsList'>
          {defaultContexts && defaultContexts.map(context =>
            <ContextRow currentLocation={currentLocation} group={context} routeParams={routeParams} key={context.id} />
          )}
        </ul>
        <ul styleName='s.groupsList'>
          <li styleName={cx('s.sectionTitle', 's.sectionTitleSeparator')}>My Groups</li>
          {groups.map(group =>
            <ContextRow currentLocation={currentLocation} group={group} routeParams={routeParams} key={group.id} />
          )}
        </ul>
        <div styleName='s.newGroup'>
          <Button
            color='white'
            styleName='s.newGroupBtn'
            label='Start a Group'
            onClick={this.props.goToCreateGroup}
          />
        </div>
      </div>
    </div>
  }
}

export function ContextRow ({ currentLocation, group, routeParams }) {
  const { avatarUrl, context, name, newPostCount, slug } = group
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)
  const showBadge = newPostCount > 0
  const path = contextSwitchingUrl({ groupSlug: slug, context }, routeParams)
  return <li styleName={cx('s.contextRow', { 's.currentContext': currentLocation === path })}>
    <Link to={contextSwitchingUrl({ context: context || 'groups', groupSlug: slug }, routeParams)} styleName='s.contextRowLink' title={name}>
      <div styleName='s.contextRowAvatar' style={imageStyle} />
      <span styleName='s.group-name'>{name}</span>
      {showBadge && <Badge expanded number={newPostCount} />}
    </Link>
  </li>
}

function Logo ({ group }) {
  if (!group) return null
  const { slug, name, location, avatarUrl } = group
  return <Link styleName='s.currentGroup' to={groupUrl(slug)}>
    <div styleName='s.avatar' style={bgImageStyle(avatarUrl || DEFAULT_AVATAR)} />
    <div className='drawer-inv-bd'>{name}</div>
    <div className='drawer-inv-sm'>{location}</div>
  </Link>
}
