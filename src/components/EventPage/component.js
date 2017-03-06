import React from 'react'

const { string, bool } = React.PropTypes

export default function EventPage ({ params: { eventId } }) {
  return <div styleName='event-page'>
    This is the individual event page for event with id { eventId }.
  </div>
}
EventPage.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
