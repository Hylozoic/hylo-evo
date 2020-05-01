import React from 'react'
import './RequestCompletion.scss'
import DropdownButton from 'components/DropdownButton'

export default function RequestCompletion ({ isFulfilled, fulfillPost, unfulfillPost }) {
  var label

  switch (isFulfilled) {
    case false:
      label = 'I still need this'
      break
    // case true:
    //   label = 'I no longer need this'
    //   break
    case true:
      label = 'This request was completed'
      break
    default:
      label = 'I still need this'
  }

  const choices = [
    { label: 'I still need this', value: false },
    // { label: 'I no longer need this', value: true },
    { label: 'This request was completed', value: true }
  ]

  return <div styleName='requestCompletion'>
    <div>Do you still need this?</div>
    <DropdownButton label={label}
      choices={choices}
      onChoose={response => {
        response === true ? fulfillPost() : unfulfillPost()
      }} />
  </div>
}
