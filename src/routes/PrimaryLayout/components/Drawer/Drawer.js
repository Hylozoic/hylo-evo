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
    const { currentCommunity, communities, networks, className } = this.props
    return <div className={className} styleName='s.communityDrawer'>
      <Icon name='Ex' styleName='s.closeDrawer' />
      <Logo community={currentCommunity} />
      <Link styleName='s.settingsLink' to={'/settings'}>
        <Icon name='Settings' styleName='s.settingsIcon' /> Settings
      </Link>
      {networks.length ? <ul styleName='s.communitiesList'>
        <li styleName='s.sectionTitle'>Networked Communities</li>
        {networks.map(network =>
          <NetworkRow network={network} key={network.id} />)}
        <li styleName='s.sectionTitle'>Independent Communities</li>
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
  return <li key={`community${id}`}>
    <Link to={path || `/c/${slug}`} styleName='s.communityRow' title={name} className={badgeHoverStyles.parent}>
      <div styleName='s.avatar' style={imageStyle} />
      <span styleName={cx('s.community-name', {'s.highlight': showBadge})}>{name}</span>
      {showBadge && <Badge number={newPostCount} />}
    </Link>
  </li>
}

export class NetworkRow extends React.Component {
  constructor (props) {
    super(props)
    const expanded = props.network.communities.reduce((acc, community) =>
      acc || !!community.newPostCount,
      false)
    this.state = {
      expanded
    }
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { network } = this.props
    const { communities, name, slug, avatarUrl } = network
    const { expanded } = this.state
    const imageStyle = bgImageStyle(avatarUrl)

    return <li styleName={cx({'s.networkExpanded': expanded})}>
      <Link to={`/n/${slug}`} styleName={'s.networkRow'} title={name} className={badgeHoverStyles.parent}>
        <div styleName='s.network-name-wrapper'>
          <div styleName='s.avatar' style={imageStyle} />
          <span styleName='s.network-name'>{name}</span>
        </div>
      </Link>
      {expanded && <ul styleName='s.networkCommunitiesList'>
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
