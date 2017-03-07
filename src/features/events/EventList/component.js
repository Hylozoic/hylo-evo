import React from 'react'
import { Link } from 'react-router'

const { string, bool } = React.PropTypes

export default function EventList () {
  return <div styleName='event-list'>
    <div><Link to='events/1'>Event 1</Link></div>
    <div><Link to='events/2'>Event 2</Link></div>
    <div><Link to='events/3'>Event 3</Link></div>
    <div><Link to='events/4'>Event 4</Link></div>
  </div>
}
EventList.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
