import './datePicker.scss'
import Datetime from 'react-datetime'
import React from 'react'

function DatePicker (props) {
  return <Datetime {...props} styleName='datePicker' />
}

export default DatePicker
