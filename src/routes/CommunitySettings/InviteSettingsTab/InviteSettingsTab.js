import React, { Component } from 'react'
import './InviteSettingsTab.scss'
import Button from 'components/Button'
import Loading from 'components/Loading'
import TextInput from 'components/TextInput'
import TextareaAutosize from 'react-textarea-autosize'
import CopyToClipboard from 'react-copy-to-clipboard'
import { humanDate } from 'hylo-utils/text'

const { object, func, string } = React.PropTypes

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
      reset: false
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
    const { community, regenerateAccessCode, inviteLink, pending, pendingInvites } = this.props
    const { name } = community
    const { copied, reset } = this.state

    const onReset = () => {
      if (window.confirm("Are you sure you want to create a new join link? The current link won't work anymore if you do.")) {
        regenerateAccessCode()
        this.setTemporatyState('reset', true)
      }
    }
    const onCopy = () => this.setTemporatyState('copied', true)

    const buttonColor = highlight => highlight ? 'green' : 'green-white-green-border'

    return <div>
      <div styleName='header'>
        <div styleName='title'>Invite People</div>
        <div styleName='subtitle'>
          to {name} on Hylo
        </div>
      </div>
      {pending && <Loading />}
      {!pending && <div styleName='invite-link-settings'>
        <div styleName='invite-link-text'>
          <div styleName='help'>Anyone with this link can join the community</div>
          {inviteLink && <div styleName='invite-link'>{inviteLink}</div>}
          {!inviteLink && <div styleName='help'>No link has been set yet</div>}
        </div>
        <div styleName='buttons'>
          <Button onClick={onReset}
            color={buttonColor(reset)}
            styleName='reset-button'
            narrow
            small>
            {reset
              ? 'Reset'
              : (inviteLink ? 'Reset Link' : 'New Link')}
          </Button>
          {inviteLink && <CopyToClipboard text={inviteLink} onCopy={onCopy}>
            <Button color={buttonColor(copied)} styleName='copy-button' narrow small>
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
          </CopyToClipboard>}
        </div>
      </div>}

      <div styleName='email-section'>
        <TextInput styleName='email-addresses-input' placeholder='Type email addresses' />
        <TextareaAutosize minRows={5} styleName='invite-msg-input' value={`Hey! Here's an invite to the ${name} community on Hylo`} />
        <div styleName='send-invite-button'>
          <Button color='green' disabled narrow small>
            Send Invite
          </Button>
        </div>
      </div>

      <div styleName='pending-invites-section'>
        <div styleName='pending-invites-header'>
          <h1 style={{flex: 1}}>Pending Invites</h1>
          <Button styleName='resend-all-button' color='green-white-green-border' narrow small>
            Resend All
          </Button>
        </div>
        <div styleName='pending-invites-list'>
          {pendingInvites.map(invite => <div styleName='row' key={invite.id}>
            <div style={{flex: 1}}>
              <span>{invite.email}</span>
              <span styleName='invite-date'>{humanDate(invite.date)}</span>
            </div>
            <div style={{width: 150}}>
              <span styleName='expire-btn'>Expire</span>
              <span styleName='resend-btn'>Resend</span>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  }
}
