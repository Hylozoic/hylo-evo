import React from 'react'
import './EventRSVP.scss'
import DropdownButton from 'components/DropdownButton'
import { RESPONSES } from 'store/models/EventInvitation'

export default function EventRSVP ({ myEventResponse, respondToEvent, position }) {
  var label

  switch (myEventResponse) {
    case RESPONSES.YES:
      label = 'Going'
      break
    case RESPONSES.INTERESTED:
      label = 'Interested'
      break
    case RESPONSES.NO:
      label = 'Not Going'
      break
    default:
      label = 'RSVP'
  }

  const choices = [
    { label: 'Going', value: RESPONSES.YES },
    { label: 'Interested', value: RESPONSES.INTERESTED },
    { label: 'Not Going', value: RESPONSES.NO }
  ]

  return <div styleName='eventRSVP'>
    <DropdownButton label={label}
      choices={choices}
      onChoose={response => respondToEvent(response)}
      position={position} />
  </div>
}
