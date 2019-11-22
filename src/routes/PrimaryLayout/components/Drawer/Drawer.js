import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import s from './Drawer.scss' // eslint-disable-line no-unused-vars
import badgeHoverStyles from '../../../../components/Badge/component.scss'
import { DEFAULT_AVATAR } from 'store/models/Community'
import cx from 'classnames'
import { isEmpty, sum } from 'lodash/fp'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

const { string, number, arrayOf, shape } = PropTypes

export default class Drawer extends React.PureComponent {
  static propTypes = {
    community: shape({
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
    const { community, network, communities, networks, className, toggleDrawer, canModerate } = this.props
    return <div className={className} styleName='s.communityDrawer'>
      <Icon name='Ex' styleName='s.closeDrawer' onClick={toggleDrawer} />
      <Logo community={community} network={network} />
      {canModerate && <Link styleName='s.settingsLink' to={`/c/${community.slug}/settings`}>
        <Icon name='Settings' styleName='s.settingsIcon' /> Settings
      </Link>}
      {networks.length ? <ul styleName='s.communitiesList'>
        {!HOLOCHAIN_ACTIVE &&
          <li styleName='s.sectionTitle'>Networked Communities</li>}
        {!HOLOCHAIN_ACTIVE && networks.map(network =>
          <NetworkRow network={network} key={network.id} />)}
        {!HOLOCHAIN_ACTIVE &&
          <li styleName={cx('s.sectionTitle', 's.sectionTitleSeparator')}>Independent Communities</li>}
        {HOLOCHAIN_ACTIVE &&
          <li styleName='s.sectionTitle'>Communities</li>}
        {communities.map(community =>
          <CommunityRow {...community} key={community.id} />
        )}
      </ul> : null}
      {!HOLOCHAIN_ACTIVE && <Button
        color='white'
        styleName='s.newCommunity'
        label='Start a Community'
        onClick={this.props.goToCreateCommunity}
      />}
    </div>
  }
}

export function CommunityRow ({ id, name, slug, path, avatarUrl, newPostCount, isMember = true }) {
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)
  const showBadge = newPostCount > 0
  return <li styleName='s.communityRow'>
    <Link to={path || `/c/${slug}`} styleName='s.communityRowLink' title={name}>
      <div styleName='s.communityRowAvatar' style={imageStyle} />
      <span styleName={cx('s.community-name', { 's.is-member': isMember })}>{name}</span>
      {showBadge && <Badge expanded number={newPostCount} />}
    </Link>
  </li>
}

export class NetworkRow extends React.Component {
  constructor (props) {
    super(props)
    const expanded = !!sum(props.network.communities.map(c => c.newPostCount))

    this.state = {
      expanded,
      seeAllExpanded: false
    }
  }

  toggleExpanded = e => {
    e.preventDefault()
    this.setState({
      expanded: !this.state.expanded
    })
  }

  toggleSeeAll = e => {
    e.preventDefault()
    this.setState({
      seeAllExpanded: !this.state.seeAllExpanded
    })
  }

  render () {
    const { network } = this.props
    const { communities, name, slug, avatarUrl, nonMemberCommunities } = network
    const { expanded, seeAllExpanded } = this.state
    const newPostCount = sum(network.communities.map(c => c.newPostCount))
    const imageStyle = bgImageStyle(avatarUrl)
    const showCommunities = !isEmpty(communities)

    const path = network.path || `/n/${slug}`

    return <li styleName={cx('s.networkRow', { 's.networkExpanded': expanded })}>
      <Link to={path} styleName='s.networkRowLink' title={name} className={badgeHoverStyles.parent}>
        <div styleName='s.network-name-wrapper'>
          <div styleName='s.avatar' style={imageStyle} />
          <span styleName='s.network-name'>{name}</span>
          {showCommunities && <span styleName='s.communitiesButton' onClick={this.toggleExpanded}>
            {expanded
              ? <Icon name='ArrowDown' styleName='s.arrowDown' />
              : newPostCount
                ? <Badge number={newPostCount} expanded />
                : <Icon name='ArrowForward' styleName='s.arrowForward' />}
          </span>}
        </div>
      </Link>
      {showCommunities && expanded && <ul styleName='s.networkCommunitiesList'>
        {communities.map(community =>
          <CommunityRow {...community} key={community.id} />)}
        {(seeAllExpanded && !isEmpty(nonMemberCommunities)) && nonMemberCommunities.map(community =>
          <CommunityRow {...community} key={community.id} isMember={false} />)}
        {!isEmpty(nonMemberCommunities) && <li styleName='s.seeAllBtn' onClick={this.toggleSeeAll}>
          {seeAllExpanded ? 'See less' : 'See all'}
        </li>}
      </ul>}
    </li>
  }
}

function Logo ({ community, network }) {
  if (!community && !network) return null
  const { slug, name, location, avatarUrl } = (community || network)
  const link = `/${community ? 'c' : 'n'}/${slug}`
  return <Link styleName='s.currentCommunity' to={link}>
    <div styleName='s.avatar' style={bgImageStyle(avatarUrl || DEFAULT_AVATAR)} />
    <div styleName='s.name' className='drawer-inv-bd'>{name}</div>
    <div className='drawer-inv-sm'>{location}</div>
  </Link>
}
