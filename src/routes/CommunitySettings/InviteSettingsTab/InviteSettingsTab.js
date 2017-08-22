import React, { Component } from 'react'
import './InviteSettingsTab.scss'
import Button from 'components/Button'
import Loading from 'components/Loading'
import CopyToClipboard from 'react-copy-to-clipboard'
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
    const { community, regenerateAccessCode, inviteLink, pending } = this.props
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
    </div>
  }
}
