import React, { PropTypes, Component } from 'react'
import './ReplaceComponent.scss'
const { string } = PropTypes

export default class ReplaceComponent extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { exampleProp } = this.props
    return <div styleName='exampleName'>{exampleProp}</div>
  }
}
