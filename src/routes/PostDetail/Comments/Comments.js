import React, { PropTypes, Component } from 'react'
import Comment from './Comment'
import './Comments.scss'
const { array } = PropTypes

export default class Comments extends Component {
  static propTypes = {
    comments: array
  }

  render () {
    const { comments } = this.props
    return <div styleName='comments'>
      {comments.map(c => <Comment comment={c} key={c.id} />)}
    </div>
  }
}
