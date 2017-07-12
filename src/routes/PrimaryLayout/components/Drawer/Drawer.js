import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { sortBy } from 'lodash/fp'
import { bgImageStyle, allCommunitiesUrl } from 'util/index'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import AllFeedsIcon from 'components/AllFeedsIcon'
import s from './Drawer.scss' // eslint-disable-line no-unused-vars
import badgeHoverStyles from '../../../../components/Badge/component.scss'
const { string, number, arrayOf, shape } = PropTypes
import cx from 'classnames'

function NewCommunity () {
  return <div>
    <Icon name='NewCommunity' styleName='s.newCommunityIcon' />
    New community
  </div>
}

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
      communities: arrayOf(shape({
        id: string,
        name: string,
        slug: string,
        avatarUrl: string
      }))
    }))
  }

  render () {
    const { currentCommunity, memberships, className } = this.props

    return <div className={className} styleName='s.communityDrawer'>
      <Icon name='Ex' styleName='s.closeDrawer' />
      <Logo community={currentCommunity} />
      <ul styleName='s.communitiesList'>
        <li>
          <Link styleName='s.allCommunities' to={allCommunitiesUrl()}>
            <AllFeedsIcon />
            <span styleName='s.allCommunitiesText' className='drawer-inv-lg'>All Communities</span>
          </Link>
        </li>
        {memberships.map(membership =>
          <CommunityRow membership={membership} key={membership.id} />)}
      </ul>
      <Button styleName='s.newCommunity' label={<NewCommunity />} />
    </div>
  }
}

export function CommunityRow ({ membership }) {
  const { community, newPostCount } = membership
  const imageStyle = bgImageStyle(community.avatarUrl)
  const showBadge = newPostCount > 0
  return <li key={`community${community.id}`} >
    <Link to={`/c/${community.slug}`} styleName='s.communityRow' title={community.name} className={badgeHoverStyles.parent}>
      <div styleName='s.avatar' style={imageStyle} />
      <span styleName={cx('s.community-name', {'s.highlight': showBadge})}>{community.name}</span>
      {showBadge && <Badge number={newPostCount} />}
    </Link>
  </li>
}

export function NetworkRow () {
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
