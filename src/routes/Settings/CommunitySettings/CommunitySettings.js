import React, { PropTypes, Component } from 'react'
import './CommunitySettings.scss'
const { string } = PropTypes

export default class CommunitySettings extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { exampleProp } = this.props
    return <div styleName='exampleName'>CommunitySettings</div>
  }
}
