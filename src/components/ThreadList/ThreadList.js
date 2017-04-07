import React, { PropTypes, Component } from 'react'
import './ThreadList.scss'
const { string } = PropTypes

export default class ThreadList extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { exampleProp } = this.props
    return <div styleName='exampleName'>{exampleProp}</div>
  }
}
