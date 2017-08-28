import React from 'react'
import '../Signup.scss'

export default function LeftSidebar (props) {
  return <div styleName='sidebar'>
    <p styleName='gray-text close-button'>CLOSE</p>
    <p styleName='sidebar-header'>{props.header}</p>
    <p styleName='gray-text'>{props.body}</p>
  </div>
}
