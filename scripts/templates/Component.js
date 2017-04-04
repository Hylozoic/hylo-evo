import React, { PropTypes, Component } from 'react'
import './component.scss'
const { string } = PropTypes

export default class ReplaceComponent extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { exampleProp } = this.props
    return <div>{exampleProp}</div>
  }
}
