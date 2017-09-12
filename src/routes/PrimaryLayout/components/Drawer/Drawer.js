import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import s from './Drawer.scss' // eslint-disable-line no-unused-vars
import badgeHoverStyles from '../../../../components/Badge/component.scss'
const { string, number, arrayOf, shape } = PropTypes
import cx from 'classnames'

export const ALL_COMMUNITIES_AVATAR_PATH = '/assets/all-communities-avatar.png'

export default class Drawer extends Component {
  static propTypes = {
    currentCommunity: shape({
      id: string,
      name: string,
      location: string,
      slug: string,
      avatarUrl: string
    }),
    memberships: arrayOf(shape({
      id: string,
      newPostCount: number,
      community: shape({
        name: string,
        slug: string,
        avatarUrl: string
      })
    })),
    networks: arrayOf(shape({
      id: string,
      name: string,
      avatarUrl: string,
      memberships: arrayOf(shape({
        id: string,
        newPostCount: number,
        community: shape({
          name: string,
          slug: string,
          avatarUrl: string
        })
      }))
    }))
  }

  render () {
    const { currentCommunity, memberships, networks, className } = this.props
    const allCommunitiesLink = {
      id: 'all',
      path: '/all',
      name: 'All Communities',
      avatarUrl: ALL_COMMUNITIES_AVATAR_PATH
    }
    return <div className={className} styleName='s.communityDrawer'>
      <Icon name='Ex' styleName='s.closeDrawer' />
      <Logo community={currentCommunity} />
      {networks.length ? <ul styleName='s.networkList'>
        <li styleName='s.sectionTitle'>Networks</li>
        {networks.map(network =>
          <NetworkRow network={network} key={network.id} />)}
      </ul> : null}
      <ul styleName='s.communitiesList'>
        <li styleName='s.sectionTitle'>Communities</li>
        <CommunityRow community={allCommunitiesLink} />
        {memberships.map(membership =>
          <CommunityRow {...membership} key={membership.id} />
        )}
      </ul>
      <Button color='white' styleName='s.newCommunity' label='Start a Community' />
    </div>
  }
}

export function CommunityRow ({ community, newPostCount }) {
  const { id, name, slug, path, avatarUrl } = community
  const imageStyle = bgImageStyle(avatarUrl)
  const showBadge = newPostCount > 0
  return <li key={`community${id}`}>
    <Link to={path || `/c/${slug}`} styleName='s.communityRow' title={name} className={badgeHoverStyles.parent}>
      <div styleName='s.avatar' style={imageStyle} />
      <span styleName={cx('s.community-name', {'s.highlight': showBadge})}>{community.name}</span>
      {showBadge && <Badge number={newPostCount} />}
    </Link>
  </li>
}

export function NetworkRow ({ network }) {
  const { id, memberships, name, slug } = network
  const imageStyle = bgImageStyle(network.avatarUrl)
  return <li key={`network${id}`}>
    <Link to={`/n/${slug}`} styleName='s.networkRow' title={name} className={badgeHoverStyles.parent}>
      <div styleName='s.network-name-wrapper'>
        <div styleName='s.avatar' style={imageStyle} />
        <span styleName='s.network-name'>{name}</span>
      </div>
    </Link>
    <ul styleName='s.networkCommunitiesList'>
      {memberships.map(membership =>
        <CommunityRow {...membership} key={membership.id} />)}
    </ul>
  </li>
}

function Logo ({ community }) {
  if (!community) return null
  const { slug, name, location, avatarUrl } = community
  return <Link styleName='s.currentCommunity' to={`/c/${slug}`}>
    <div styleName='s.avatar' style={bgImageStyle(avatarUrl)} />
    <div styleName='s.name' className='drawer-inv-bd'>{name}</div>
    <div className='drawer-inv-sm'>{location}</div>
  </Link>
}
