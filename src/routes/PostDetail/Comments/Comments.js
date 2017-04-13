import React, { PropTypes, Component } from 'react'
import Comment from './Comment'
import CommentForm from './CommentForm'
import './Comments.scss'
const { array, func, object, number } = PropTypes

export default class Comments extends Component {
  static propTypes = {
    comments: array,
    commentsTotal: number,
    fetchComments: func,
    createComment: func,
    currentUser: object
  }

  render () {
    const { comments, commentsTotal, fetchComments, currentUser, createComment } = this.props
    return <div styleName='comments'>
      <ShowMore
        commentsLength={comments.length}
        commentsTotal={commentsTotal}
        fetchComments={fetchComments} />
      {comments.map(c => <Comment comment={c} key={c.id} />)}
      <CommentForm currentUser={currentUser} createComment={createComment} />
    </div>
  }
}

export function ShowMore ({commentsLength, commentsTotal, fetchComments}) {
  if (commentsLength >= commentsTotal) return null

  const extra = commentsTotal - commentsLength

  return <div styleName='showMore' onClick={fetchComments}>
    View {extra} previous comment{extra > 1 ? 's' : ''}
  </div>
}
