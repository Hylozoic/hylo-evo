import './datePicker.scss'
import Button from 'components/Button/Button'
import Datetime from 'react-datetime'
import React, { useState } from 'react'

function isValidDate (current) {
  const yesterday = Datetime.moment().subtract(1, 'day')
  return current.isAfter(yesterday)
}

function DatePicker (props) {
  const { placeholder } = props
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Datetime
        {...props}
        styleName='datePicker'
        isValidDate={isValidDate}
        inputProps={{ placeholder }}
        closeOnClickOutside={false}
        closeOnSelect
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        onChange={() => setIsOpen(false)}
        open={isOpen}
      />
      {isOpen && <Button label='Cancel' onClick={() => setIsOpen(false)} />}
    </>
  )
}

export default DatePicker
