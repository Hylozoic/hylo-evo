import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import styles from './MembershipRequestsTab.scss'
import { jollyAxolotl } from 'util/assets'

const { array, func, object } = PropTypes

export default class MembershipRequestsTab extends Component {
  static propTypes = {
    joinRequests: array,
    community: object,
    currentUser: object,
    acceptJoinRequest: func,
    declineJoinRequest: func,
    viewMembers: func
  }

  state = {
    modalVisible: false
  }

  componentDidMount () {
    const { communityId } = this.props
    this.props.fetchJoinRequests(communityId)
  }

  submitAccept = (joinRequestId, communityId, userId) => {
    this.props.acceptJoinRequest(joinRequestId, communityId, userId)
  }
  
  
  submitDecline = (joinRequestId) => {
    this.props.declineJoinRequest(joinRequestId)
  }

  viewMembers = () => {
    const { community } = this.props
    this.props.viewMembers(community.slug)
  }

  render () {
    const { community, joinRequests } = this.props

    if (!joinRequests) return <Loading />

    return  joinRequests.length
      ? <NewRequests 
          accept={this.submitAccept}
          decline={this.submitDecline} 
          community={community}
          joinRequests={joinRequests}
          selectedRequestId={joinRequests[0].id}/>
    : <NoRequests community={community} viewMembers={this.viewMembers} />
  }
}

export function NoRequests({ community, viewMembers }) {
  return (
    <React.Fragment>
      <div styleName='no-requests'>
        <img src={jollyAxolotl}/><br/>
        <div>
          <h2>No new membership requests</h2>
          We'll notify you by email when someone wants to join <strong>{community.name}</strong>
        </div>
        <Button
          label='View Current Members'
          onClick={viewMembers}
          styleName='view-members'
          />
        </div>
    </React.Fragment>
  )
}

export function NewRequests({accept, decline, community, joinRequests}) {
  return (
    <React.Fragment>
      <div styleName='header'>
        <h2>People want to join your community!</h2>
        <span styleName='response-time'>Your average response time: 1 day</span>
      </div>
      <div styleName='request-list'>
        {joinRequests.map(r => <JoinRequest
          accept={accept}
          decline={decline} 
          community={community}
          request={r}/>)}
      </div>
    </React.Fragment>
  )
}

export function JoinRequest({ accept, decline, community, request }) {
  const { user } = request

  return (
    <div styleName="request">
      <div styleName='requestor'>
        <Avatar avatarUrl={user.avatarUrl} url={`/m/${user.id}`} styleName='requestorAvatar'/>
        <div styleName='requestorInfo'>
          <div styleName='name'>{user.name}</div>
          <div styleName='skills'>{user.skills.items.map(({ name }) => <span>#{name}</span>)}</div>
        </div>
      </div>
      <div styleName='action-buttons'>
          <div styleName='accept' onClick={() => accept(request.id, community.id, user.id)}><Icon name='Checkmark' styleName='icon-green' />Welcome</div>
          <div onClick={() => decline(request.id)}><Icon name='Ex' styleName='icon-red' />Decline</div>
        </div>
    </div>
  )
}