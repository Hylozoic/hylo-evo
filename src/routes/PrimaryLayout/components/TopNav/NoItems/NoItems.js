import React from 'react'
import { bgImageStyle } from 'util/index'
import './NoItems.scss'

export default function NoItems ({ message }) {
  return (
    <div styleName='no-items'>
      <h3>{message}</h3>
      <div styleName='image' style={bgImageStyle('/assets/hey-axolotl.png')} />
    </div>
  )
}
