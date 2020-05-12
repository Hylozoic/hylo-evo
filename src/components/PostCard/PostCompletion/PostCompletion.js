import React from 'react'
import './PostCompletion.scss'
import DropdownButton from 'components/DropdownButton'

export default function PostCompletion ({ type, startTime, endTime, isFulfilled, fulfillPost, unfulfillPost }) {
  var label

  switch (isFulfilled) {
    case false:
      type === 'request' ? label = 'I still need this' : label = 'Available'
      break
    case true:
      type === 'request' ? label = 'This request was completed' : label = 'Unavailable'
      break
    case 'expired':
      type === 'request' ? label = 'I no longer need this' : label = 'Unavailable'
      break
    default:
      label = 'I still need this'
  }

  let choices

  const requestChoices = [
    { label: 'I still need this', value: false },
    { label: 'I no longer need this', value: 'expired' },
    { label: 'This request was completed', value: true }
  ]

  const offerChoices = [
    { label: 'Available', value: false },
    { label: 'Unavailable', value: true }
  ]

  type === 'request' ? choices = requestChoices : choices = offerChoices

  return <div styleName='postCompletion'>
    <div>{type === 'request' ? 'Do you still need this?' : 'Is this still available?'}</div>
    <DropdownButton label={label}
      choices={choices}
      onChoose={response => {
        response === false ? unfulfillPost() : fulfillPost()
      }} />
  </div>
}
