import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './CommunitySettingsTab.scss'
import { Link } from 'react-router-dom'
import { DEFAULT_AVATAR } from 'store/models/Community'
import { communityUrl } from 'util/index'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'

const { array, func } = PropTypes

export default class CommunitySettingsTab extends Component {
  static propTypes = {
    memberships: array,
    updateMembershipSettings: func
  }

  render () {
    const { memberships, leaveCommunity, updateMembershipSettings } = this.props
    if (!memberships) return <Loading />

    return <div>
      {memberships.map(m =>
        <CommunityControl
          membership={m}
          leaveCommunity={leaveCommunity}
          updateMembershipSettings={updateMembershipSettings}
          key={m.id} />)}
    </div>
  }
}

export function CommunityControl ({ membership, leaveCommunity }) {
  const leave = () => {
    if (window.confirm(`Are you sure you want to leave ${community.name}?`)) {
      leaveCommunity(community.id)
    }
  }

  const { community } = membership

  return <div styleName='community-control'>
    <div styleName='row'>
      <Link to={communityUrl(community.slug)}>
        <RoundImage url={community.avatarUrl || DEFAULT_AVATAR} medium styleName='avatar' />
      </Link>
      <Link to={communityUrl(community.slug)} styleName='name'>{community.name}</Link>
      <span onClick={leave} styleName='leave-button'>Leave</span>
    </div>
  </div>
}
