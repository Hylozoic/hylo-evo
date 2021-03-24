import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import GroupButton from 'components/GroupButton'
import Loading from 'components/Loading'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import { currentUserSettingsUrl } from 'util/navigation'

import './ManageInvitesTab.scss'

const { array, bool, func } = PropTypes

export default class ManageInvitesTab extends Component {
  static propTypes = {
    canceledJoinRequests: array,
    cancelJoinRequest: func,
    loading: bool,
    pendingJoinRequests: array,
    rejectedJoinRequests: array
  }

  componentDidMount () {
    this.props.fetchJoinRequests()
  }

  render () {
    const { canceledJoinRequests, cancelJoinRequest, loading, pendingJoinRequests, rejectedJoinRequests } = this.props

    if (loading) return <Loading />

    return (
      <div styleName='container'>
        <h1 styleName='title'>Group Invitations &amp; Join Requests</h1>

        <div styleName='description'>
          This list contains all open requests and invitations to join groups.
          To view all groups you are a part of go to your <Link to={currentUserSettingsUrl('groups')}>Affiliations</Link>.
        </div>

        <h2 styleName='subhead'>Invitations to Join New Groups</h2>
        TODO

        <h2 styleName='subhead'>Your Open Requests to Join Groups</h2>
        <div styleName='requestList'>
          {pendingJoinRequests.length > 0 && pendingJoinRequests.map((jr) =>
            <JoinRequest
              joinRequest={jr}
              cancelJoinRequest={cancelJoinRequest}
              key={jr.id}
            />
          )}
        </div>

        <h2 styleName='subhead'>Declined Invitations &amp; Requests</h2>
        <div styleName='requestList'>
          {rejectedJoinRequests.length > 0 && rejectedJoinRequests.map((jr) =>
            <JoinRequest
              joinRequest={jr}
              key={jr.id}
            />
          )}
          {canceledJoinRequests.length > 0 && canceledJoinRequests.map((jr) =>
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
        <span styleName='createdDate'>Requested {moment(createdAt).format('YYYY-MM-DD')}</span>
        {joinRequest.status === JOIN_REQUEST_STATUS.Pending ? <span onClick={cancel} styleName='cancelButton'>Cancel</span>
          : joinRequest.status === JOIN_REQUEST_STATUS.Rejected ? <span styleName='declinedCanceled'>Declined</span>
            : joinRequest.status === JOIN_REQUEST_STATUS.Canceled ? <span styleName='declinedCanceled'>Canceled</span>
              : ''
        }
      </div>
    </div>
  )
}
