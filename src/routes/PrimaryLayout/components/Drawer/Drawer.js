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
import { isEmpty, sum } from 'lodash/fp'

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
    const { currentCommunityOrNetwork, communities, networks, className } = this.props
    return <div className={className} styleName='s.communityDrawer'>
      <Icon name='Ex' styleName='s.closeDrawer' />
      <Logo community={currentCommunityOrNetwork} />
      <Link styleName='s.settingsLink' to={'/settings'}>
        <Icon name='Settings' styleName='s.settingsIcon' /> Settings
      </Link>
      {networks.length ? <ul styleName='s.communitiesList'>
        <li styleName='s.sectionTitle'>Networked Communities</li>
        {networks.map(network =>
          <NetworkRow network={network} key={network.id} />)}
        <li styleName={cx('s.sectionTitle', 's.sectionTitleSeparator')}>Independent Communities</li>
        {communities.map(community =>
          <CommunityRow {...community} key={community.id} />
        )}
      </ul> : null}
      <Button
        color='white'
        styleName='s.newCommunity'
        label='Start a Community'
        onClick={this.props.goToCreateCommunity}
      />
    </div>
  }
}

export function CommunityRow ({ id, name, slug, path, avatarUrl, newPostCount }) {
  const imageStyle = bgImageStyle(avatarUrl)
  const showBadge = newPostCount > 0
  return <li styleName='s.communityRow'>
    <Link to={path || `/c/${slug}`} styleName='s.communityRowLink' title={name} className={badgeHoverStyles.parent}>
      <div styleName='s.communityRowAvatar' style={imageStyle} />
      <span styleName={cx('s.community-name', {'s.highlight': showBadge})}>{name}</span>
      {showBadge && <Badge number={newPostCount} />}
    </Link>
  </li>
}

export class NetworkRow extends React.Component {
  constructor (props) {
    super(props)
    const expanded = !!sum(props.network.communities.map(c => c.newPostCount))

    this.state = {
      expanded
    }
  }

  toggleExpanded = e => {
    e.preventDefault()
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { network } = this.props
    const { communities, name, slug, avatarUrl } = network
    const { expanded } = this.state
    const newPostCount = sum(network.communities.map(c => c.newPostCount))
    const imageStyle = bgImageStyle(avatarUrl)
    const showCommunities = !isEmpty(communities)

    const path = network.path || `/n/${slug}`

    return <li styleName={cx('s.networkRow', {'s.networkExpanded': expanded})}>
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
      </ul>}
    </li>
  }
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
