import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import GroupButton from 'components/GroupButton'
import Loading from 'components/Loading'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import { currentUserSettingsUrl, personUrl } from 'util/navigation'

import './ManageInvitesTab.scss'

const { array, bool, func } = PropTypes

export default class ManageInvitesTab extends Component {
  static propTypes = {
    acceptInvite: func,
    canceledJoinRequests: array,
    cancelJoinRequest: func,
    loading: bool,
    pendingGroupInvites: array,
    pendingJoinRequests: array,
    rejectedJoinRequests: array
  }

  componentDidMount () {
    this.props.fetchMyInvitesAndRequests()
  }

  render () {
    const {
      acceptInvite,
      canceledJoinRequests,
      cancelJoinRequest,
      declineInvite,
      loading,
      pendingGroupInvites,
      pendingJoinRequests,
      rejectedJoinRequests
    } = this.props

    if (loading) return <Loading />

    return (
      <div styleName='container'>
        <h1 styleName='title'>Group Invitations &amp; Join Requests</h1>

        <div styleName='description'>
          This list contains all open requests and invitations to join groups.
          To view all groups you are a part of go to your <Link to={currentUserSettingsUrl('groups')}>Affiliations</Link>.
        </div>

        <h2 styleName='subhead'>Invitations to Join New Groups</h2>
        <div styleName='requestList'>
          {pendingGroupInvites.map(invite =>
            <GroupInvite
              acceptInvite={acceptInvite}
              declineInvite={declineInvite}
              invite={invite}
              key={invite.id}
            />
          )}
        </div>

        <h2 styleName='subhead'>Your Open Requests to Join Groups</h2>
        <div styleName='requestList'>
          {pendingJoinRequests.map((jr) =>
            <JoinRequest
              joinRequest={jr}
              cancelJoinRequest={cancelJoinRequest}
              key={jr.id}
            />
          )}
        </div>

        <h2 styleName='subhead'>Declined Invitations &amp; Requests</h2>
        <div styleName='requestList'>
          {rejectedJoinRequests.map((jr) =>
            <JoinRequest
              joinRequest={jr}
              key={jr.id}
            />
          )}
          {canceledJoinRequests.map((jr) =>
            <JoinRequest
              joinRequest={jr}
              key={jr.id}
            />
          )}
        </div>

      </div>
    )
  }
}

function GroupInvite ({ acceptInvite, declineInvite, invite }) {
  const { creator, createdAt, group, id, token } = invite

  const decline = () => {
    if (window.confirm(`Are you sure you want to decline the invitation to join ${group.name}?`)) {
      declineInvite(id)
    }
  }

  return (
    <div styleName='joinRequest'>
      <div styleName='invitationDetail'>
        <div styleName='invitationSource'>
          <div>
            <Link to={personUrl(creator.id)} styleName='creator'>{creator.name}</Link>
            <span>invited you to join</span>
          </div>
          <div styleName='requestGroup'>
            <GroupButton group={group} />
          </div>
        </div>
        <div styleName='invitationResponse'>
          <span styleName='createdDate'>Sent {moment(createdAt).format('MM-DD-YYYY')}</span>
          <span onClick={decline} styleName='cancelButton'>Decline</span>
          <span onClick={() => acceptInvite(token, group.slug)} styleName='joinButton'>Join</span>
        </div>
      </div>
    </div>
  )
}

function JoinRequest ({ joinRequest, cancelJoinRequest }) {
  const { createdAt, group, id } = joinRequest

  const cancel = () => {
    if (window.confirm(`Are you sure you want to cancel your request to join ${group.name}?`)) {
      cancelJoinRequest(id)
    }
  }

  return (
    <div styleName='joinRequest'>
      <div styleName='requestGroup'>
        <GroupButton group={group} />
      </div>
      <div styleName='requestDetail'>
        <span styleName='createdDate joinRequestDate'>Requested {moment(createdAt).format('YYYY-MM-DD')}</span>
        {joinRequest.status === JOIN_REQUEST_STATUS.Pending && (
          <span onClick={cancel} styleName='cancelButton'>Cancel</span>
        )}
        {joinRequest.status === JOIN_REQUEST_STATUS.Rejected && (
          <span styleName='declinedCanceled'>Declined</span>
        )}
        {joinRequest.status === JOIN_REQUEST_STATUS.Canceled && (
          <span styleName='declinedCanceled'>Canceled</span>
        )}
      </div>
    </div>
  )
}
