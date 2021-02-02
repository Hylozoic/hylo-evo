import React, { Component } from 'react'
import './CreateGroup.scss'

export default class CreateGroup extends Component {
  render () {
    return <div styleName='modal'>
      {<this.props.component {...this.props} />}
    </div>
  }
}
