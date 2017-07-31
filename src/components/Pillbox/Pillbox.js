import React from 'react'
import './Pillbox.scss'
import cx from 'classnames'

export default function Pillbox ({ pills }) {
  return <div styleName='container'>
    {pills.map(pill => <Pill key={pill.id} {...pill} />)}
  </div>
}

export function Pill ({id, label, onClick, className, small}) {
  return <span styleName={cx('pill', {'clickable': onClick, small})} className={className}>
    {label}
  </span>
}
