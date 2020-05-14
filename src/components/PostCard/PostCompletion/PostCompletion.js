import React from 'react'
import './PostCompletion.scss'
import DropdownButton from 'components/DropdownButton'

export default function PostCompletion ({ type, startTime, endTime, isFulfilled, fulfillPost, unfulfillPost }) {
  var label

  switch (isFulfilled) {
    case false:
      label = (type === 'request' ? 'I still need this' : 'Available')
      break
    case true:
      label = (type === 'request' ? 'This request was completed' : 'Unvailable')
      break
    case 'expired':
      label = (type === 'request' ? 'I no longer need this' : 'Unvailable')
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
