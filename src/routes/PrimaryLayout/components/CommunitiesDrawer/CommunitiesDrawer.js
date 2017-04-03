import React from 'react'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import AllFeedsIcon from 'components/AllFeedsIcon'
import './component.scss'

function NewCommunity () {
  return <div>
    <Icon name='NewCommunity' styleName='newCommunityIcon' />
    New community
  </div>
}

export default class CommunitiesDrawer extends React.Component {
  static propTypes = {
    currentCommunity: React.PropTypes.object,
    communities: React.PropTypes.array,
    communityNotifications: React.PropTypes.array
  }

  render () {
    const { currentCommunity, communities, communityNotifications } = this.props
    const imageStyle = bgImageStyle(currentCommunity.avatarUrl)
    return <div styleName='drawer'>
      <Icon name='Ex' styleName='closeDrawer' />
      <Link styleName='currentCommunity' to={`/c/${currentCommunity.slug}`}>
        <div styleName='avatar' style={imageStyle} />
        <div styleName='name' className='drawer-inv-bd'>{currentCommunity.name}</div>
        <div className='drawer-inv-sm'>{currentCommunity.location}</div>
      </Link>
      <ul styleName='communitiesList'>
        <li>
          <Link styleName='allCommunities' to='/all'>
            <AllFeedsIcon />
            <span styleName='allCommunitiesText' className='drawer-inv-lg'>All Communities</span>
          </Link>
        </li>
        {communities.map(community => {
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
