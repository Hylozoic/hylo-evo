import React, { PropTypes, Component } from 'react'
import './CommunitySettings.scss'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
const { array } = PropTypes
import { communityUrl } from 'util/index'

export default class CommunitySettings extends Component {
  static propTypes = {
    communities: array
  }

  render () {
    const { communities, leaveCommunity } = this.props
    if (!communities) return <Loading />

    return <div>
      {communities.map(c =>
        <CommunityControl community={c} leaveCommunity={leaveCommunity} key={c.id} />)}
    </div>
  }
}

export function CommunityControl ({ community, leaveCommunity }) {
  const leave = () => {
    if (window.confirm(`Are you sure you want to leave ${community.name}?`)) {
      leaveCommunity(community.id)
    }
  }
  return <div styleName='community-control'>
    <Link to={communityUrl(community.slug)}>
      <RoundImage url={community.avatarUrl} medium styleName='avatar' />
    </Link>
    <Link to={communityUrl(community.slug)} styleName='name'>{community.name}</Link>
    <span onClick={leave} styleName='leave-button'>Leave</span>
  </div>
}
