import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import GroupButton from 'components/GroupButton'
import Loading from 'components/Loading'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import { currentUserSettingsUrl, personUrl } from 'util/navigation'

import classes from './ManageInvitesTab.module.scss'

const { array, bool, func } = PropTypes

class ManageInvitesTab extends Component {
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
      rejectedJoinRequests,
      t
    } = this.props

    if (loading) return <Loading />

    return (
      <div className={classes.container}>
        <h1 className={classes.title}>{t('Group Invitations & Join Requests')}</h1>

        <div className={classes.description}>
          {t('This list contains all open requests and invitations to join groups.')}
          {t('To view all groups you are a part of go to your')}{' '}<Link to={currentUserSettingsUrl('groups')}>{t('Affiliations')}</Link>.
        </div>

        <h2 className={classes.subhead}>{t('Invitations to Join New Groups')}</h2>
        <div className={classes.requestList}>
          {pendingGroupInvites.map(invite =>
            <GroupInvite
              acceptInvite={acceptInvite}
              declineInvite={declineInvite}
              invite={invite}
              key={invite.id}
            />
          )}
        </div>

        <h2 className={classes.subhead}>{t('Your Open Requests to Join Groups')}</h2>
        <div className={classes.requestList}>
          {pendingJoinRequests.map((jr) =>
            <JoinRequest
              joinRequest={jr}
              cancelJoinRequest={cancelJoinRequest}
              key={jr.id}
            />
          )}
        </div>

        <h2 className={classes.subhead}>{t('Declined Invitations & Requests')}</h2>
        <div className={classes.requestList}>
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
  const { t } = useTranslation()

  const decline = () => {
    if (window.confirm(t('Are you sure you want to decline the invitation to join {{groupName}}?', { groupName: group.name }))) {
      declineInvite(id)
    }
  }

  return (
    <div className={classes.joinRequest}>
      <div className={classes.invitationDetail}>
        <div className={classes.invitationSource}>
          <div>
            <Link to={personUrl(creator.id)} className={classes.creator}>{creator.name}</Link>
            <span>{t('invited you to join')}</span>
          </div>
          <div className={classes.requestGroup}>
            <GroupButton group={group} />
          </div>
        </div>
        <div className={classes.invitationResponse}>
          <span className={classes.createdDate}>{t('Sent')} {moment(createdAt).format('MM-DD-YYYY')}</span>
          <span onClick={decline} className={classes.cancelButton}>{t('Decline')}</span>
          <span onClick={() => acceptInvite(token, group.slug)} className={classes.joinButton}>{t('Join')}</span>
        </div>
      </div>
    </div>
  )
}

function JoinRequest ({ joinRequest, cancelJoinRequest }) {
  const { createdAt, group, id } = joinRequest
  const { t } = useTranslation()

  const cancel = () => {
    if (window.confirm(t('Are you sure you want to cancel your request to join {{groupName}}?', { groupName: group.name }))) {
      cancelJoinRequest(id)
    }
  }

  return (
    <div className={classes.joinRequest}>
      <div className={classes.requestGroup}>
        <GroupButton group={group} />
      </div>
      <div className={classes.requestDetail}>
        <span className={`${classes.createdDate} ${classes.joinRequestDate}`}>{t('Requested')} {moment(createdAt).format('YYYY-MM-DD')}</span>
        {joinRequest.status === JOIN_REQUEST_STATUS.Pending && (
          <span onClick={cancel} className={classes.cancelButton}>{t('Cancel')}</span>
        )}
        {joinRequest.status === JOIN_REQUEST_STATUS.Rejected && (
          <span className={classes.declinedCanceled}>{t('Declined')}</span>
        )}
        {joinRequest.status === JOIN_REQUEST_STATUS.Canceled && (
          <span className={classes.declinedCanceled}>{t('Canceled')}</span>
        )}
      </div>
    </div>
  )
}
export default withTranslation()(ManageInvitesTab)
