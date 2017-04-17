import React, { PropTypes, Component } from 'react'
import './Settings.scss'
const { string } = PropTypes

export default class Settings extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { exampleProp } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        Settings
      </div>
    </div>
  }
}
