import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './InviteSettingsTab.scss'
import Button from 'components/Button'
import Loading from 'components/Loading'
import Switch from 'components/Switch'
import TextareaAutosize from 'react-textarea-autosize'
import CopyToClipboard from 'react-copy-to-clipboard'
import { humanDate } from 'hylo-utils/text'
import { isEmpty } from 'lodash'
import { CSSTransitionGroup } from 'react-transition-group'

const { object, func, string } = PropTypes

const parseEmailList = emails =>
  (emails || '').split(/,|\n/).map(email => {
    var trimmed = email.trim()
    // use only the email portion of a "Joe Bloggs <joe@bloggs.org>" line
    var match = trimmed.match(/.*<(.*)>/)
    return match ? match[1] : trimmed
  })

export default class InviteSettingsTab extends Component {
  static propTypes = {
    group: object,
    regenerateAccessCode: func,
    inviteLink: string
  }

  constructor (props) {
    super(props)

    const defaultMessage = `Hi!

I'm inviting you to join ${props.group.name} group on Hylo.

${props.group.name} is using Hylo for our online group: this is our dedicated space for communication & collaboration.`
    this.state = {
      copied: false,
      reset: false,
      emails: '',
      message: defaultMessage,
      allMembersCanInvite: undefined
    }
  }

  setTemporatyState (key, value) {
    const oldValue = this.state[key]
    this.setState({ [key]: value })
    setTimeout(() => {
      this.setState({ [key]: oldValue })
    }, 3000)
  }

  sendInvites = () => {
    if (this.sending) return
    this.sending = true

    const { createInvitations, trackAnalyticsEvent } = this.props
    const { emails, message } = this.state

    createInvitations(parseEmailList(emails), message)
      .then(res => {
        this.sending = false
        const { invitations } = res.payload.data.createInvitation
        const badEmails = invitations.filter(email => email.error).map(e => e.email)

        const numBad = badEmails.length
        let errorMessage, successMessage
        if (numBad === 1) {
          errorMessage = 'The address below is invalid.'
        } else if (numBad > 1) {
          errorMessage = `The ${numBad} addresses below are invalid.`
        }
        const numGood = invitations.length - badEmails.length
        if (numGood > 0) {
          successMessage = `Sent ${numGood} ${numGood === 1 ? 'email' : 'emails'}.`
          trackAnalyticsEvent('Group Invitations Sent', { numGood })
        }
        this.setState({
          emails: badEmails.join('\n'),
          errorMessage,
          successMessage
        })
      })
  }

  componentWillReceiveProps (nextProps) {
    const { group } = this.props
    const nextPropsGroup = nextProps.group
    if (group && nextPropsGroup && group !== nextPropsGroup) {
      this.setState({ allMembersCanInvite: nextPropsGroup.allowGroupInvites })
    }
  }

  toggleAllMembersCanInvite = () => {
    const groupId = this.props.group.id
    const allMembersCanInvite = !this.state.allMembersCanInvite
    this.props.allowGroupInvites(groupId, allMembersCanInvite)
      .then(({ error }) => {
        if (error) {
          this.setState({ allMembersCanInvite: !allMembersCanInvite })
        }
      })
    this.setState({ allMembersCanInvite })
  }

  render () {
    const {
      group,
      pendingCreate,
      regenerateAccessCode,
      inviteLink,
      pending,
      pendingInvites = [],
      expireInvitation,
      resendInvitation,
      reinviteAll,
      canModerate
    } = this.props
    const { name } = group
    const { copied, reset, emails, errorMessage, successMessage, allMembersCanInvite } = this.state

    const onReset = () => {
      if (window.confirm("Are you sure you want to create a new join link? The current link won't work anymore if you do.")) {
        regenerateAccessCode()
        this.setTemporatyState('reset', true)
      }
    }

    const isPendingInvites = !isEmpty(pendingInvites)

    const onCopy = () => this.setTemporatyState('copied', true)

    const buttonColor = highlight => highlight ? 'green' : 'green-white-green-border'

    const disableSendBtn = (isEmpty(emails) || pendingCreate)

    const resendAllOnClick = () => {
      if (window.confirm('Are you sure you want to resend all Pending Invitations')) {
        reinviteAll()
      }
    }

    const expireOnClick = (invitationToken) => {
      expireInvitation(invitationToken)
    }

    const resendOnClick = (invitationToken) => {
      resendInvitation(invitationToken)
    }

    return <div>
      <div styleName='styles.header'>
        <div styleName='styles.title'>Invite People</div>
        <div styleName='styles.subtitle'>
          to {name} on Hylo
        </div>
      </div>
      {pending && <Loading />}
      {!pending && canModerate && <div styleName='styles.switch-header'>
        <span styleName='styles.switch-label'>Let anyone in this group send invites</span>
        <Switch styleName='styles.switch' value={allMembersCanInvite} onClick={this.toggleAllMembersCanInvite} />
      </div>}
      {!pending && <div styleName='styles.invite-link-settings'>
        <div styleName='styles.invite-link-text'>
          <div styleName='styles.help'>Anyone with this link can join the group</div>
          {inviteLink && <div styleName='styles.invite-link'>{inviteLink}</div>}
          {!inviteLink && <div styleName='styles.help'>No link has been set yet</div>}
        </div>
        <div styleName='styles.buttons'>
          <Button onClick={onReset}
            color={buttonColor(reset)}
            styleName='styles.reset-button'
            narrow
            small>
            {reset
              ? 'Reset'
              : (inviteLink ? 'Reset Link' : 'New Link')}
          </Button>
          {inviteLink && <CopyToClipboard text={inviteLink} onCopy={onCopy}>
            <Button color={buttonColor(copied)} styleName='styles.copy-button' narrow small>
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
          </CopyToClipboard>}
        </div>
      </div>}
      <div styleName='styles.email-section'>
        {successMessage && <span styleName='success'>{successMessage}</span>}
        {errorMessage && <span styleName='error'>{errorMessage}</span>}
        <TextareaAutosize minRows={5} styleName='styles.invite-msg-input'
          placeholder='Type email addresses'
          value={this.state.emails}
          disabled={pendingCreate}
          onChange={(event) => this.setState({ emails: event.target.value })} />
        <TextareaAutosize minRows={5} styleName='styles.invite-msg-input'
          value={this.state.message}
          disabled={pendingCreate}
          onChange={(event) => this.setState({ message: event.target.value })} />
        <div styleName='styles.send-invite-button'>
          <Button color='green' disabled={disableSendBtn} onClick={this.sendInvites} narrow small>
            Send Invite
          </Button>
        </div>
      </div>

      <div styleName='styles.pending-invites-section'>
        <div styleName='styles.pending-invites-header'>
          <h1 style={{ flex: 1 }}>{!isPendingInvites && 'No '}Pending Invites</h1>
          {isPendingInvites && <Button styleName='styles.resend-all-button'
            color='green-white-green-border'
            narrow small
            onClick={resendAllOnClick}>
            Resend All
          </Button>}
        </div>
        <div styleName='styles.pending-invites-list'>
          <CSSTransitionGroup
            transitionName={{
              enter: styles['enter'],
              enterActive: styles['enter-active'],
              leave: styles['leave'],
              leaveActive: styles['leave-active']
            }}
            transitionEnterTimeout={400}
            transitionLeaveTimeout={500}>
            {pendingInvites.map(invite => <div styleName='styles.row' key={invite.id}>
              <div style={{ flex: 1 }}>
                <span>{invite.email}</span>
                <span styleName='styles.invite-date'>{humanDate(invite.lastSentAt)}</span>
              </div>
              <div styleName='styles.invite-actions'>
                <span styleName='styles.action-btn styles.expire-btn' onClick={() => expireOnClick(invite.id)}>Expire</span>
                <span styleName='styles.action-btn styles.resend-btn' onClick={() => !invite.resent && resendOnClick(invite.id)}>{invite.resent ? 'Sent' : 'Resend'}</span>
              </div>
            </div>)}
          </CSSTransitionGroup>
        </div>
      </div>
    </div>
  }
}
