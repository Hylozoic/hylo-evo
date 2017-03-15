import React from 'react'
import Icon from 'components/Icon'

const ICON_NAMES = [
  'Messages',
  'Notification',
  'Search',
  'Share',
  'Members',
  'Topics',
  'Projects',
  'Events',
  'Home'
]

export default function Elements (props) {
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
