import React from 'react'
import Icon from 'components/Icon'
import s from './component.scss' // eslint-disable-line no-unused-vars
import layout from '../css/layout.scss' // eslint-disable-line no-unused-vars

const ICON_NAMES = [
  'Messages',
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
  'Location'
]

export default function Elements (props) {
  return <div>
    <div styleName='layout.sheet'>
      <div styleName='layout.sheet-title'>Icons</div>
      <div styleName='layout.sheet-flexbox'>
        {ICON_NAMES.map(name => <div styleName='s.iconCard' key={name}>
          <Icon name={name} styleName='s.icon' />
          <div styleName='s.name' className='hdr-subheadline'>{name}</div>
          <div styleName='s.code' className='bdy-lt-sm'>{`<Icon name='${name}' />`}</div>
        </div>)}
      </div>
    </div>
  </div>
}
