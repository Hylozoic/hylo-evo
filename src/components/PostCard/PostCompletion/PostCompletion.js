import React from 'react'
import moment from 'moment'
import './PostCompletion.scss'
import DropdownButton from 'components/DropdownButton'

const isAvailableBasedOnDates = (startTime, endTime) => {
  const current = moment()
  let available = true

  if (!startTime && !endTime) {
    return available
  } else if (endTime && current.isAfter(moment(endTime))) {
    available = false
  }
  return available
}

export default function PostCompletion ({ type, startTime, endTime, isFulfilled, fulfillPost, unfulfillPost }) {
  var label

  const isAvailable = isAvailableBasedOnDates(startTime, endTime)
  if (isFulfilled === false && isAvailable === false) {
    isFulfilled = 'expired'
  }

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
        response === true ? fulfillPost() : unfulfillPost()
      }} />
  </div>
}
