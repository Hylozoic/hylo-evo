import React, { PropTypes, Component } from 'react'
import './Members.scss'
const { string } = PropTypes

export default class Members extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { exampleProp } = this.props
    return <span className='hdr-display'>Members</span>
    //return <div styleName='exampleName'>{exampleProp}</div>
  }
}
