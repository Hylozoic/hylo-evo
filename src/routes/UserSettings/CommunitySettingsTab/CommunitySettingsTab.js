import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './CommunitySettingsTab.scss'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import CheckBox from 'components/CheckBox'
import { communityUrl } from 'util/index'

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

export function CommunityControl ({ membership, leaveCommunity, updateMembershipSettings }) {
  const leave = () => {
    if (window.confirm(`Are you sure you want to leave ${community.name}?`)) {
      leaveCommunity(community.id)
    }
  }

  const { community, settings = {} } = membership

  const updateSetting = setting => value =>
    updateMembershipSettings(community.id, {[setting]: value})

  return <div styleName='community-control'>
    <div styleName='row'>
      <Link to={communityUrl(community.slug)}>
        <RoundImage url={community.avatarUrl} medium styleName='avatar' />
      </Link>
      <Link to={communityUrl(community.slug)} styleName='name'>{community.name}</Link>
      <span onClick={leave} styleName='leave-button'>Leave</span>
    </div>
    <div styleName='settings-row'>
      <span styleName='settings-label'>Receive Notifications:</span>
      <span styleName='settings'>
        <span styleName='checkbox-label'>Email</span>
        <CheckBox checked={settings.sendEmail} onChange={updateSetting('sendEmail')} />
        <span styleName='checkbox-label'>Mobile</span>
        <CheckBox checked={settings.sendPushNotifications} onChange={updateSetting('sendPushNotifications')} />
      </span>
    </div>
  </div>
}
