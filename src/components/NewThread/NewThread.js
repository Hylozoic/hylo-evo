import React, { PropTypes, Component } from 'react'
import './NewThread.scss'
const { string } = PropTypes

export default class NewThread extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { exampleProp } = this.props
    return <div styleName='exampleName'>{exampleProp}</div>
  }
}
