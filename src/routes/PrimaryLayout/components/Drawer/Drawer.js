import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { sortBy } from 'lodash/fp'
import { bgImageStyle, allCommunitiesUrl } from 'util/index'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import AllFeedsIcon from 'components/AllFeedsIcon'
import './Drawer.scss'
const { string, number, arrayOf, shape } = PropTypes

function NewCommunity () {
  return <div>
    <Icon name='NewCommunity' styleName='newCommunityIcon' />
    New community
  </div>
}

export default class Drawer extends Component {
  static defaultProps = {
    communityNotifications: []
  }

  static propTypes = {
    currentCommunity: shape({
      id: string,
      name: string,
      location: string,
      slug: string,
      avatarUrl: string
    }),
    communities: arrayOf(shape({
      id: string,
      name: string,
      slug: string,
      avatarUrl: string
    })),
    communityNotifications: arrayOf(shape({
      communityId: string,
      count: number
    }))
  }

  render () {
    const { currentCommunity, communities, communityNotifications } = this.props
    const communitiesSorted = sortBy('name', communities)
    return <div styleName='drawer'>
      <Icon name='Ex' styleName='closeDrawer' />
      <Logo community={currentCommunity} />
      <ul styleName='communitiesList'>
        <li>
          <Link styleName='allCommunities' to={allCommunitiesUrl()}>
            <AllFeedsIcon />
            <span styleName='allCommunitiesText' className='drawer-inv-lg'>All Communities</span>
          </Link>
        </li>
        {communitiesSorted.map(community => {
          const imageStyle = bgImageStyle(community.avatarUrl)
          const badge = communityNotifications.find(n => n && n.communityId === community.id)
          return <li styleName='community' key={`community${community.id}`}>
            <Link to={`/c/${community.slug}`} title={community.name}>
              <div styleName='avatar' style={imageStyle} />
              <span styleName='name' className='drawer-inv-li'>{community.name}</span>
              {badge && <Badge number={badge.count} styleName='badge' expanded='true' />}
            </Link>
          </li>
        })}
      </ul>
      <Button styleName='newCommunity' label={<NewCommunity />} />
    </div>
  }
}

function Logo ({ community }) {
  if (!community) return null
  const { slug, name, location, avatarUrl } = community
  return <Link styleName='currentCommunity' to={`/c/${slug}`}>
    <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
    <div styleName='name' className='drawer-inv-bd'>{name}</div>
    <div className='drawer-inv-sm'>{location}</div>
  </Link>
}
