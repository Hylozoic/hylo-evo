import React from 'react'
import './InviteSettingsTab.scss'
import Button from 'components/Button'
import CopyToClipboard from 'react-copy-to-clipboard'

const { object } = React.PropTypes

export default function InviteSettingsTab ({ community, resetLink, inviteLink }) {
  const { name } = community
  // const inviteLink = 'https://www.hylo.com/c/hylo/join/aelaknetiken'

  const onReset = () => {
    if (window.confirm("Are you sure you want to create a new join link? The current link won't work anymore if you do.")) {
      resetLink()
    }
  }
  const onCopy = () => console.log('copied')

  return <div>
    <div styleName='header'>
      <div styleName='title'>Invite People</div>
      <div styleName='subtitle'>
        to {name} on Hylo
      </div>
    </div>
    <div styleName='invite-link-settings'>
      <div styleName='invite-link-text'>
        <div styleName='help'>Anyone with this link can join the community</div>
        <div styleName='invite-link'>{inviteLink}</div>
      </div>
      <div styleName='buttons'>
        <Button onClick={onReset}
          color='green-white-green-border'
          styleName='reset-button'
          narrow
          small>
          Reset Link
        </Button>
        <CopyToClipboard text={inviteLink} onCopy={onCopy}>
          <Button color='green-white-green-border' styleName='button' narrow small>
            Copy Link
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  </div>
}
InviteSettingsTab.propTypes = {
  community: object
}
