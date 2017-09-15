import React, { Component } from 'react'
import './CreateCommunity.scss'

export default class CreateCommunity extends Component {
  render () {
    return <div styleName='modal'>
      {<this.props.component />}
    </div>
  }
}
