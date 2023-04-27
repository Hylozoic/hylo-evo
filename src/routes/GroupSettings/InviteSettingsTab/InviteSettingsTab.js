import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Button from 'components/Button'
import Loading from 'components/Loading'
import TextareaAutosize from 'react-textarea-autosize'
import CopyToClipboard from 'react-copy-to-clipboard'
import { TextHelpers } from 'hylo-shared'
import { isEmpty } from 'lodash'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Icon from 'components/Icon'
import isMobile from 'ismobilejs'
import ReactTooltip from 'react-tooltip'

import styles from './InviteSettingsTab.scss'

const { object, func, string } = PropTypes

const parseEmailList = emails =>
  (emails || '').split(/,|\n/).map(email => {
    const trimmed = email.trim()
    // use only the email portion of a "Joe Bloggs <joe@bloggs.org>" line
    const match = trimmed.match(/.*<(.*)>/)
    return match ? match[1] : trimmed
  })

class InviteSettingsTab extends Component {
  static propTypes = {
    group: object,
    regenerateAccessCode: func,
    inviteLink: string
  }

  constructor (props) {
    super(props)

    const defaultMessage = this.props.t(`Hi!

I'm inviting you to join {{name}} on Hylo.

{{name}} is using Hylo for our online community: this is our dedicated space for communication & collaboration.1`, { name: props.group.name })
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

  handleSendInvites = () => {
    if (this.sending) return
    this.sending = true

    const { createInvitations, trackAnalyticsEvent, t } = this.props
    const { emails, message } = this.state

    createInvitations(parseEmailList(emails), message)
      .then(res => {
        this.sending = false
        const { invitations } = res.payload.data.createInvitation
        const badEmails = invitations.filter(email => email.error).map(e => e.email)

        const numBad = badEmails.length
        let errorMessage, successMessage
        if (numBad > 0) {
          errorMessage = `${t('{{numBad}} invalid email address/es found (see above)).', { numBad })}{' '}`
        }
        const numGood = invitations.length - badEmails.length
        if (numGood > 0) {
          successMessage = t(`Sent {{numGood}} {{email}}`, { numGood, email: numGood === 1 ? 'email' : 'emails' })
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
      reinviteAll,
      t
    } = this.props
    const { copied, reset, emails, errorMessage, successMessage } = this.state

    const onReset = () => {
      if (window.confirm(t("Are you sure you want to create a new join link? The current link won't work anymore if you do."))) {
        regenerateAccessCode()
        this.setTemporatyState('reset', true)
      }
    }

    const hasPendingInvites = !isEmpty(pendingInvites)

    const onCopy = () => this.setTemporatyState('copied', true)

    const buttonColor = highlight => highlight ? 'green' : 'green-white-green-border'

    const disableSendBtn = (isEmpty(emails) || pendingCreate)

    const resendAllOnClick = () => {
      if (window.confirm(t('Are you sure you want to resend all Pending Invitations'))) {
        reinviteAll()
      }
    }

    const expireOnClick = (invitationToken) => {
      expireInvitation(invitationToken)
    }

    const resendOnClick = (invitationToken) => {
      resendInvitation(invitationToken)
    }

    return (
      <div styleName='styles.container'>
        <div styleName='styles.header'>
          <div styleName='styles.title'>{t('Invite People')}</div>
        </div>

        {pending && <Loading />}

        {!pending && (
          <>
            <div styleName='styles.invite-link-section'>
              <div styleName='styles.subtitle'>
                {t('Share a Join Link')}
              </div>
              <div styleName='styles.help'>
                {t('Anyone can join ')}<span style={{ fontWeight: 'bold' }}>{group.name}</span> {t('with this link')}.{' '}{inviteLink && t('Click or press on it to copy it')}:
              </div>
              <div styleName='styles.invite-link-settings'>
                {inviteLink && (
                  <div styleName='styles.invite-link'>
                    {!copied && (
                      <>
                        <CopyToClipboard text={inviteLink} onCopy={onCopy}>
                          <span data-tip={t('Click to Copy')} data-for='invite-link-tooltip'>
                            {inviteLink}
                            <Icon name='Copy' styleName='styles.copy-icon' />
                          </span>
                        </CopyToClipboard>
                        {!isMobile.any && (
                          <ReactTooltip
                            place='top'
                            type='dark'
                            id='invite-link-tooltip'
                            effect='solid'
                            delayShow={500}
                          />
                        )}
                      </>
                    )}
                    {copied && t('Copied!')}
                  </div>
                )}
                <Button onClick={onReset} styleName='styles.invite-link-button' color={buttonColor(reset)}>
                  {inviteLink ? t('Reset Link') : t('Generate a Link')}
                </Button>
              </div>
            </div>
          </>
        )}

        <div styleName='styles.email-section'>
          <div styleName='styles.subtitle'>
            {t('Send Invites via email')}
          </div>
          <div styleName='styles.help'>{t('Email addresses of those you\'d like to invite:')}</div>
          <TextareaAutosize
            minRows={1}
            styleName='styles.invite-msg-input'
            placeholder={t('Type email addresses (multiples should be separated by either a comma or new line)')}
            value={this.state.emails}
            disabled={pendingCreate}
            onChange={(event) => this.setState({ emails: event.target.value })}
          />
          <div styleName='styles.help'>{t('Customize the invite email message (optional):')}</div>
          <TextareaAutosize
            minRows={5}
            styleName='styles.invite-msg-input'
            value={this.state.message}
            disabled={pendingCreate}
            onChange={(event) => this.setState({ message: event.target.value })}
          />
          <div styleName='styles.send-invite-button'>
            <div styleName='styles.send-invite-feedback'>
              {errorMessage && <span styleName='error'>{errorMessage}</span>}
              {successMessage && <span styleName='success'>{successMessage}</span>}
            </div>
            <Button color='green' disabled={disableSendBtn} onClick={this.handleSendInvites} narrow small>
              {t('Send Invite')}
            </Button>
          </div>
        </div>

        {hasPendingInvites && (
          <div styleName='styles.pending-invites-section'>
            <div styleName='styles.pending-invites-header'>
              <div styleName='styles.subtitle'>{t('Pending Invites')}</div>
              {hasPendingInvites && (
                <Button
                  styleName='styles.resend-all-button'
                  color='green-white-green-border'
                  narrow small
                  onClick={resendAllOnClick}
                >
                  {t('Resend All')}
                </Button>
              )}
            </div>
            <div styleName='styles.pending-invites-list'>
              <TransitionGroup>
                {pendingInvites.map((invite, index) => (
                  <CSSTransition
                    classNames={{
                      enter: styles.enter,
                      enterActive: styles['enter-active'],
                      exit: styles.exit,
                      exitActive: styles['exit-active']
                    }}
                    timeout={{ enter: 400, exit: 500 }}
                    key={index}
                  >
                    <div styleName='styles.row' key={invite.id}>
                      <div style={{ flex: 1 }}>
                        <span>{invite.email}</span>
                        <span styleName='styles.invite-date'>{TextHelpers.humanDate(invite.lastSentAt)}</span>
                      </div>
                      <div styleName='styles.invite-actions'>
                        <span styleName='styles.action-btn styles.expire-btn' onClick={() => expireOnClick(invite.id)}>{t('Expire')}</span>
                        <span styleName='styles.action-btn styles.resend-btn' onClick={() => !invite.resent && resendOnClick(invite.id)}>{invite.resent ? this.props('Sent') : this.props('Resend')}</span>
                      </div>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          </div>
        )}
      </div>
    )
  }
}
export default withTranslation()(InviteSettingsTab)
