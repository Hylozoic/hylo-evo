import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import Loading from 'components/Loading'
import TextareaAutosize from 'react-textarea-autosize'
import CopyToClipboard from 'react-copy-to-clipboard'
import { humanDate } from 'hylo-utils/text'
import { isEmpty } from 'lodash'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Icon from 'components/Icon'
import isMobile from 'ismobilejs'
import ReactTooltip from 'react-tooltip'

import styles from './InviteSettingsTab.scss'

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
      message: defaultMessage
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
        if (numBad > 0) {
          errorMessage = `${numBad} invalid email address/es found (see above). `
        }
        const numGood = invitations.length - badEmails.length
        if (numGood > 0) {
          successMessage = `Sent ${numGood} ${numGood === 1 ? 'email.' : 'emails.'}`
          trackAnalyticsEvent('Group Invitations Sent', { numGood })
        }
        this.setState({
          emails: badEmails.join('\n'),
          errorMessage,
          successMessage
        })
      })
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
      reinviteAll
    } = this.props
    const { copied, reset, emails, errorMessage, successMessage } = this.state

    const onReset = () => {
      if (window.confirm("Are you sure you want to create a new join link? The current link won't work anymore if you do.")) {
        regenerateAccessCode()
        this.setTemporatyState('reset', true)
      }
    }

    const hasPendingInvites = !isEmpty(pendingInvites)

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

    return <div styleName='styles.container'>
      <div styleName='styles.header'>
        <div styleName='styles.title'>Invite People</div>
      </div>

      {pending && <Loading />}

      {!pending && <>
        <div styleName='styles.invite-link-section'>
          <div styleName='styles.subtitle'>
            Share a Join Link
          </div>
          <div styleName='styles.help'>
            Anyone can join <span style={{ fontWeight: 'bold' }}>{group.name}</span> with this link{inviteLink && '. Click or press on it to copy it'}:
          </div>
          <div styleName='styles.invite-link-settings'>
            {inviteLink && <div styleName='styles.invite-link'>
              {!copied && <>
                <CopyToClipboard text={inviteLink} onCopy={onCopy}>
                  <span data-tip='Click to Copy' data-for='invite-link-tooltip'>
                    {inviteLink}
                    <Icon name='Copy' styleName='styles.copy-icon' />
                  </span>
                </CopyToClipboard>
                {!isMobile.any && (
                  <ReactTooltip place='top'
                    type='dark'
                    id='invite-link-tooltip'
                    effect='solid'
                    delayShow={500}
                  />
                )}
              </>}
              {copied && 'Copied!'}
            </div>}
            <Button onClick={onReset} styleName='styles.invite-link-button' color={buttonColor(reset)}>
              {inviteLink ? 'Reset Link' : 'Generate a Link'}
            </Button>
          </div>
        </div>
      </>}

      <div styleName='styles.email-section'>
        <div styleName='styles.subtitle'>
          Send Invites via email
        </div>
        <div styleName='styles.help'>Email addresses of those you'd like to invite:</div>
        <TextareaAutosize minRows={1} styleName='styles.invite-msg-input'
          placeholder='Type email addresses (multiples should be separated by either a comma or new line)'
          value={this.state.emails}
          disabled={pendingCreate}
          onChange={(event) => this.setState({ emails: event.target.value })} />
        <div styleName='styles.help'>Customize the invite email message (optional):</div>
        <TextareaAutosize minRows={5} styleName='styles.invite-msg-input'
          value={this.state.message}
          disabled={pendingCreate}
          onChange={(event) => this.setState({ message: event.target.value })} />
        <div styleName='styles.send-invite-button'>
          <div styleName='styles.send-invite-feedback'>
            {errorMessage && <span styleName='error'>{errorMessage}</span>}
            {successMessage && <span styleName='success'>{successMessage}</span>}
          </div>
          <Button color='green' disabled={disableSendBtn} onClick={this.sendInvites} narrow small>
            Send Invite
          </Button>
        </div>
      </div>

      {hasPendingInvites && (
        <div styleName='styles.pending-invites-section'>
          <div styleName='styles.pending-invites-header'>
            <div styleName='styles.subtitle'>Pending Invites</div>
            {hasPendingInvites && (
              <Button styleName='styles.resend-all-button'
                color='green-white-green-border'
                narrow small
                onClick={resendAllOnClick}>
                Resend All
              </Button>
            )}
          </div>
          <div styleName='styles.pending-invites-list'>
            <TransitionGroup>
              {pendingInvites.map(invite => (
                <CSSTransition
                  classNames={{
                    enter: styles['enter'],
                    enterActive: styles['enter-active'],
                    exit: styles['exit'],
                    exitActive: styles['exit-active']
                  }}
                  timeout={{ enter: 400, exit: 500 }}
                >
                  <div styleName='styles.row' key={invite.id}>
                    <div style={{ flex: 1 }}>
                      <span>{invite.email}</span>
                      <span styleName='styles.invite-date'>{humanDate(invite.lastSentAt)}</span>
                    </div>
                    <div styleName='styles.invite-actions'>
                      <span styleName='styles.action-btn styles.expire-btn' onClick={() => expireOnClick(invite.id)}>Expire</span>
                      <span styleName='styles.action-btn styles.resend-btn' onClick={() => !invite.resent && resendOnClick(invite.id)}>{invite.resent ? 'Sent' : 'Resend'}</span>
                    </div>
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        </div>
      )}
    </div>
  }
}
