import React from 'react'
import './TextInput.scss'

export default function TextInput (props) {
  // TODO: different styles based on props, e.g. validated, error, etc.
  return <div styleName='wrapper'>
    <input styleName='input' {...props} />
  </div>
}
