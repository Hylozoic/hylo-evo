import React from 'react'
import './PostCompletion.scss'
import DropdownButton from 'components/DropdownButton'

export default function PostCompletion ({ type, startTime, endTime, isFulfilled, fulfillPost, unfulfillPost }) {
  var label

  const promptOptions = {
    request: 'Do you still need this?',
    offer: 'Is this still available?',
    resource: 'Is this still available?',
    project: 'Is this still active?'
  }

  const messages = {
    request: [
      { label: 'I still need this', value: false },
      { label: 'I no longer need this', value: 'expired' },
      { label: 'This request was completed', value: true }
    ],
    offer: [
      { label: 'Available', value: false },
      { label: 'Unavailable', value: 'expired' },
      { label: 'Unavailable', value: true }
    ],
    resource: [
      { label: 'Available', value: false },
      { label: 'Unavailable', value: 'expired' },
      { label: 'Unavailable', value: true }
    ],
    project: [
      { label: 'Active', value: false },
      { label: 'Inactive', value: 'expired' },
      { label: 'Completed', value: true }
    ]
  }

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
      label = 'I still need this'
  }

  const prompt = promptOptions[type]
  const choiceOptions = {
    request: messages['request'],
    offer: [
      { label: 'Available', value: false },
      { label: 'Unavailable', value: true }
    ],
    resource: [
      { label: 'Available', value: false },
      { label: 'Unavailable', value: true }
    ],
    project: messages['project']
  }
  const choices = choiceOptions[type]

  return <div styleName='postCompletion'>
    <div>{prompt}</div>
    <DropdownButton label={label}
      choices={choices}
      onChoose={response => {
        response === false ? unfulfillPost() : fulfillPost()
      }} />
  </div>
}
