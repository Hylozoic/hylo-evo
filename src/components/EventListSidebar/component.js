import React from 'react'

const { string, bool } = React.PropTypes

export default function EventListSidebar () {
  return <div styleName='event-list-sidebar'>
    This is the contents of the event list sidebar, unexpanded phase
  </div>
}
EventListSidebar.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
