import React, { PropTypes, Component } from 'react'
import './Comments.scss'
const { array } = PropTypes

export default class Comments extends Component {
  static propTypes = {
    comments: array
  }

  render () {
    const { comments } = this.props
    return <div styleName='comments'>Comments go here</div>
  }
}
