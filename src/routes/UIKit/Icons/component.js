import React from 'react'
import Icon from 'components/Icon'
import './component.scss'

const ICON_NAMES = [
  'Circle',
  'Messages',
  'Ex',
  'NewCommunity',
  'Notifications',
  'Search',
  'Share',
  'Members',
  'Topics',
  'Projects',
  'Events',
  'Home',
  'More',
  'ArrowUp',
  'Location',
  'Flag',
  'Complete',
  'Pin',
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
