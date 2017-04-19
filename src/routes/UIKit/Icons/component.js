import React from 'react'
import Icon from 'components/Icon'
import './component.scss'

const ICON_NAMES = [
  'Clock',
  'AddImage',
  'Reply',
  'LinkedIn',
  'Google',
  'Facebook',
  'Ex',
  'NewCommunity',
  'Projects',
  'Events',
  'Home',
  'Topics',
  'Members',
  'Messages',
  'Notifications',
  'Search',
  'Share',
  'More',
  'ArrowUp',
  'ArrowDown',
  'Location',
  'Trash',
  'Pin',
  'Complete',
  'Flag',
  'Circle',
  'ProfileFacebook',
  'ProfileLinkedin',
  'ProfileTwitter',
  'ProfileUrl',
  'Star'
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
