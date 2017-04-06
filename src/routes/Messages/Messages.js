import React, { PropTypes, Component } from 'react'
import './Messages.scss'
const { string } = PropTypes

export default class Messages extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { exampleProp } = this.props
    return <div styleName='exampleName'>{exampleProp}</div>
  }
}
