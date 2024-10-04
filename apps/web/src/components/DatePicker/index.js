import classes from './datePicker.module.scss'
import Datetime from 'react-datetime'
import React from 'react'

function isValidDate (current) {
  const yesterday = Datetime.moment().subtract(1, 'day')
  return current.isAfter(yesterday)
}

function DatePicker (props) {
  const { placeholder } = props
  return (
    <Datetime
      {...props}
      className={classes.datePicker}
      isValidDate={isValidDate}
      inputProps={{ placeholder }}
      className={props.className}
    />
  )
}

export default DatePicker
