import React from 'react'
import { Link } from 'react-router-dom'
import styles from './component.scss' // eslint-disable-line no-unused-vars

const { string, bool } = React.PropTypes

export default function Events () {
  return <div styleName='event-list'>
    <div><Link to='/events/1'>Event 1</Link></div>
    <div><Link to='/events/2'>Event 2</Link></div>
    <div><Link to='/events/3'>Event 3</Link></div>
    <div><Link to='/events/4'>Event 4</Link></div>
  </div>
}
Events.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
