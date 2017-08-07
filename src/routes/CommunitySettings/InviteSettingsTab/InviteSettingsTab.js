import React from 'react'
import './InviteSettingsTab.scss'
import Button from 'components/Button'

const { object } = React.PropTypes

export default function InviteSettingsTab ({ community }) {
  const { name } = community
  const inviteLink = 'https://www.hylo.com/c/hylo/join/aelaknetiken'
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
      <Button color='green-white-green-border' narrow small>Reset Link</Button>
      <Button color='green-white-green-border' narrow small>Copy Link</Button>
    </div>
  </div>
}
InviteSettingsTab.propTypes = {
  community: object
}
