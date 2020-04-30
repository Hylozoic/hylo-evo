import React from 'react'
import './RequestCompletion.scss'
import DropdownButton from 'components/DropdownButton'
// import { RESPONSES } from 'store/models/EventInvitation'

export default function RequestCompletion ({ completionResponse, respondToEvent }) {
  var label

  // to do: check if isCompleted = true
  var isCompleted = false
  var isNotNeeded = false

  switch (completionResponse) {
    case !isCompleted:
      label = 'I still need this'
      break
    case isNotNeeded:
      label = 'I no longer need this'
      break
    case isCompleted:
      label = 'This request was completed'
      break
    default:
      label = 'I still need this'
  }

  const choices = [
    { label: 'I still need this', value: false },
    { label: 'I no longer need this', value: true },
    { label: 'This request was completed', value: true }
  ]

  return <div styleName='requestCompletion'>
    <div>Do you still need this?</div>
    <DropdownButton label={label}
      choices={choices}
      onChoose={response => respondToEvent(response)} />
  </div>
}
