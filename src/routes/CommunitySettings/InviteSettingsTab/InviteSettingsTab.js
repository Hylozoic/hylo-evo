import React, { Component } from 'react'
import styles from './InviteSettingsTab.scss'
import Button from 'components/Button'
import Loading from 'components/Loading'
import TextInput from 'components/TextInput'
import TextareaAutosize from 'react-textarea-autosize'
import CopyToClipboard from 'react-copy-to-clipboard'
import { humanDate } from 'hylo-utils/text'
import { isEmpty } from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const { object, func, string } = React.PropTypes

const parseEmailList = emails =>
  (emails || '').split(/,|\n/).map(email => {
    var trimmed = email.trim()
    // use only the email portion of a "Joe Bloggs <joe@bloggs.org>" line
    var match = trimmed.match(/.*<(.*)>/)
    return match ? match[1] : trimmed
  })

export default class InviteSettingsTab extends Component {
  static propTypes = {
    community: object,
    regenerateAccessCode: func,
    inviteLink: string
  }

  constructor (props) {
    super(props)
    this.state = {
      copied: false,
      reset: false,
      emails: '',
      message: `Hey! Here’s an invite to the ${props.community.name} community on Hylo.`
    }
  }

  setTemporatyState (key, value) {
    const oldValue = this.state[key]
    this.setState({[key]: value})
    setTimeout(() => {
      this.setState({[key]: oldValue})
    }, 3000)
  }

  render () {
    const { community,
      regenerateAccessCode,
      inviteLink,
      pending,
      pendingInvites = [],
      createInvitations,
      expireInvitation,
      resendInvitation,
      reinviteAll
    } = this.props
    const { name } = community
    const { copied, reset, emails, message } = this.state

    const onReset = () => {
      if (window.confirm("Are you sure you want to create a new join link? The current link won't work anymore if you do.")) {
        regenerateAccessCode()
        this.setTemporatyState('reset', true)
      }
    }

    const isPendingInvites = !isEmpty(pendingInvites)

    const onCopy = () => this.setTemporatyState('copied', true)

    const buttonColor = highlight => highlight ? 'green' : 'green-white-green-border'

    const disableSendBtn = isEmpty(emails)

    const sendInvites = () => {
      createInvitations(parseEmailList(emails), message)
      this.setState({emails: ''})
    }

    const resendAllOnClick = () => {
      if (window.confirm('Are you sure you want to resend all Pending Invitations')) {
        reinviteAll()
      }
    }

    const expireOnClick = (invitationId) => {
      expireInvitation(invitationId)
    }

    const resendOnClick = (invitationId) => {
      resendInvitation(invitationId)
    }

    return <div>
      <div styleName='styles.header'>
        <div styleName='styles.title'>Invite People</div>
        <div styleName='styles.subtitle'>
          to {name} on Hylo
        </div>
      </div>
      {pending && <Loading />}
      {!pending && <div styleName='styles.invite-link-settings'>
        <div styleName='styles.invite-link-text'>
          <div styleName='styles.help'>Anyone with this link can join the community</div>
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
        <TextInput styleName='styles.email-addresses-input'
          placeholder='Type email addresses'
          onChange={(event) => this.setState({emails: event.target.value})}
          value={this.state.emails} />
        <TextareaAutosize minRows={5} styleName='styles.invite-msg-input'
          value={this.state.message}
          onChange={(event) => this.setState({message: event.target.value})} />
        <div styleName='styles.send-invite-button'>
          <Button color='green' disabled={disableSendBtn} onClick={sendInvites} narrow small>
            Send Invite
          </Button>
        </div>
      </div>

      <div styleName='styles.pending-invites-section'>
        <div styleName='styles.pending-invites-header'>
          <h1 style={{flex: 1}}>{!isPendingInvites && 'No '}Pending Invites</h1>
          {isPendingInvites && <Button styleName='styles.resend-all-button'
            color='green-white-green-border'
            narrow small
            onClick={resendAllOnClick}>
            Resend All
          </Button>}
        </div>
        <div styleName='styles.pending-invites-list'>
          <ReactCSSTransitionGroup
            transitionName={{
              enter: styles['enter'],
              enterActive: styles['enter-active'],
              leave: styles['leave'],
              leaveActive: styles['leave-active']
            }}
            transitionEnterTimeout={400}
            transitionLeaveTimeout={500}>
            {pendingInvites.map(invite => <div styleName='styles.row' key={invite.id}>
              <div style={{flex: 1}}>
                <span>{invite.email}</span>
                <span styleName='styles.invite-date'>{humanDate(invite.last_sent_at)}</span>
              </div>
              <div styleName='styles.invite-actions'>
                <span styleName='styles.action-btn styles.expire-btn' onClick={() => expireOnClick(invite.id)}>Expire</span>
                <span styleName='styles.action-btn styles.resend-btn' onClick={() => !invite.resent && resendOnClick(invite.id)}>{invite.resent ? 'Sent' : 'Resend'}</span>
              </div>
            </div>)}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    </div>
  }
}
