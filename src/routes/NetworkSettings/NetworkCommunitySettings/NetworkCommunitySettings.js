import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import './NetworkCommunitySettings.scss'
import Switch from 'components/Switch'
import Avatar from 'components/Avatar'
import { personUrl } from 'util/index'
import { get } from 'lodash'

export default class NetworkCommunitySettings extends Component {
  componentDidMount () {
    this.props.fetchCommunitySettings()
  }

  render () {
    const {
      moderators,
      community
    } = this.props

    if (!community) return <Loading />

    const { hidden } = community
    const toggleSwitch = () => {
      this.props.updateCommunitySettings({
        hidden: !hidden
      })
    }

    const helpText = hidden
      ? 'Turning this off means this community will appear in the network list for all network members and will let all network members see posts from this community.'
      : 'Turning this on means this community will not appear in the network list and only members of this community (not the wider network) will be able to see posts from this community.'

    return <div >
      <div styleName='switch-row'>
        <div styleName='switch-label'>
          Hide community from network
        </div>
        <Switch styleName='switch' value={hidden} onClick={toggleSwitch} />
      </div>
      <div styleName='help-text'>{helpText}</div>
      <CommunityModeratorSection leaders={moderators} slug={get('slug', community)} />
    </div>
  }
}

export function CommunityModeratorSection ({ leaders, slug }) {
  return <div styleName='moderators-section'>
    <div styleName='moderators-header'>Community Moderators</div>
    {leaders.map(l => <CommunityModerator leader={l} slug={slug} key={l.id} />)}
  </div>
}

export function CommunityModerator ({ leader, slug }) {
  const { name, avatarUrl } = leader
  return <div styleName='moderator'>
    <Avatar url={personUrl(leader.id, slug)} avatarUrl={avatarUrl} styleName='moderator-image' medium />
    <Link to={personUrl(leader.id, slug)} styleName='moderator-name'>{name}</Link>
  </div>
}
