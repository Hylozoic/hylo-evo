import React from 'react'
import './PostCompletion.scss'
import DropdownButton from 'components/DropdownButton'

const promptOptions = {
  request: 'Is this still needed?',
  offer: 'Is this still available?',
  resource: 'Is this still available?',
  project: 'Is this still active?'
}

const otherMessageOptions = [
  { label: 'Available', value: false },
  { label: 'Expired', value: 'expired' },
  { label: 'Unavailable', value: true }
]
const messages = {
  request: [
    { label: 'This is still needed', value: false },
    { label: 'No longer needed', value: 'expired' },
    { label: 'This request was completed', value: true }
  ],
  offer: otherMessageOptions,
  resource: otherMessageOptions,
  project: [
    { label: 'Active', value: false },
    { label: 'Inactive', value: 'expired' },
    { label: 'Completed', value: true }
  ]
}

export default function PostCompletion ({ type, startTime, endTime, isFulfilled, fulfillPost, unfulfillPost }) {
  var label

  switch (isFulfilled) {
    case false:
      label = messages[type].find(choice => choice.value === false).label
      break
    case true:
      label = messages[type].find(choice => choice.value === true).label
      break
    case 'expired':
      label = messages[type].find(choice => choice.value === 'expired').label
      break
    default:
      label = 'This is still needed'
  }

  const prompt = promptOptions[type]
  const choices = messages[type]

  return <div styleName='postCompletion'>
    <div>{prompt}</div>
    <DropdownButton label={label}
      choices={choices}
      onChoose={response => {
        response === false ? unfulfillPost() : fulfillPost()
      }} />
  </div>
}
