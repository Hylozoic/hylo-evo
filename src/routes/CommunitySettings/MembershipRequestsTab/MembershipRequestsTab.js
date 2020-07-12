import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Icon from 'components/Icon'
import styles from './MembershipRequestsTab.scss'

const { array, func, string } = PropTypes

export default class MembershipRequestsTab extends Component {
  static propTypes = {
    joinRequests: array,
    acceptJoinRequest: func,
    declineJoinRequest: func,
  }

  state = {
    modalVisible: false
  }

  componentDidMount () {
    const { communityId } = this.props
    this.props.fetchJoinRequests(communityId)
  }

  render () {
    const { acceptJoinRequest, declineJoinRequest, community, joinRequests } = this.props
    return  joinRequests.length
      ? <NewRequests 
          acceptJoinRequest={acceptJoinRequest}
          declineJoinRequest={declineJoinRequest} 
          community={community}
          joinRequests={joinRequests}/>
    : <NoRequests/>
  }
}

export function NoRequests() {
  return (
    <React.Fragment>
      <div>No new membership requests</div>
    </React.Fragment>
  )
}

export function NewRequests({acceptJoinRequest, declineJoinRequest, community, joinRequests}) {
  return (
    <React.Fragment>
      <div styleName='header'>
        <h2>People want to join your community!</h2>
        <span styleName='response-time'>Your average response time: 1 day</span>
      </div>
      <div styleName='request-list'>
        {joinRequests.map(r => <JoinRequest
          acceptJoinRequest={acceptJoinRequest}
          declineJoinRequest={declineJoinRequest} 
          community={community}
          request={r}/>)}
      </div>
    </React.Fragment>
  )
}

export function JoinRequest({ acceptJoinRequest, declineJoinRequest, community, request }) {
  const { user } = request

  return (
    <div>
      <div styleName='request'>
        <div styleName='requestorAvatar'><img src={user.avatarUrl}/></div>
        <div styleName='requestorInfo'>
          <div styleName='name'>{user.name}</div>
          <div styleName='skills'>{user.skills.items.map(({ id, name }) => <span>#{name}</span>)}</div>
        </div>
      </div>
      <div styleName='action-buttons'>
        <div styleName='accept' onClick={acceptJoinRequest}><Icon name='Checkmark' styleName='icon' />Welcome {user.name} into {community.name}</div>
        <div onClick={declineJoinRequest}><Icon name='Ex' styleName='icon' />Decline</div>
      </div>
    </div>
  )
}