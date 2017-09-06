import React from 'react'
import '../CreateCommunity.scss'

export default function TextInput (props) {
  return <div styleName='center'>
    <input
      styleName='text-input'
      autoFocus={props.autoFocus}
      onKeyPress={event => {
        if (event.key === 'Enter') {
          props.handleOnEnter()
        }
      }}
      onChange={props.handleInputChange}
      placeholder={props.placeholder}
      readOnly
    />
  </div>
}
