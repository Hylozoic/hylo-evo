import React from 'react'
import Icon from 'components/Icon'
import './component.scss'

const ICON_NAMES = [
  'AddImage',
  'ArrowDown',
  'ArrowForward',
  'ArrowUp',
  'Back',
  'Checkmark',
  'Circle',
  'Clock',
  'Complete',
  'Document',
  'Download',
  'Edit',
  'Empty',
  'Events',
  'Ex',
  'Facebook',
  'Flag',
  'Google',
  'Home',
  'Invite',
  'LinkedIn',
  'Location',
  'Members',
  'Messages',
  'More',
  'NewCommunity',
  'Notifications',
  'Paperclip',
  'Pin',
  'ProfileFacebook',
  'ProfileLinkedin',
  'ProfileTwitter',
  'ProfileUrl',
  'Projects',
  'Reply',
  'Search',
  'Send',
  'Settings',
  'Share',
  'Star',
  'Topics',
  'Trash'
]

export default function Icons (props) {
  return <div>
    <div className='sheet'>
      <div className='sheet-title'>Icons</div>
      <div className='sheet-flexbox'>
        {ICON_NAMES.map(name => <div styleName='iconCard' key={name}>
          <Icon name={name} styleName='icon' />
          <div styleName='name' className='hdr-subheadline'>{name}</div>
          <div styleName='code' className='bdy-lt-sm'>{`<Icon name='${name}' />`}</div>
        </div>)}
      </div>
    </div>
  </div>
}
