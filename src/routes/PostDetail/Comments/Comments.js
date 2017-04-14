import React, { PropTypes, Component } from 'react'
import Comment from './Comment'
import CommentForm from './CommentForm'
import './Comments.scss'
const { array, func, object, number, string } = PropTypes

export default class Comments extends Component {
  static propTypes = {
    comments: array,
    commentsTotal: number,
    fetchComments: func,
    createComment: func,
    currentUser: object,
    postId: string,
    slug: string
  }

  render () {
    const { comments, total, hasMore, fetchComments, currentUser, createComment, postId, slug } = this.props
    return <div styleName='comments'>
      <ShowMore
        commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={fetchComments} />
      {comments.map(c => <Comment comment={c} key={c.id} slug={slug} />)}
      <CommentForm currentUser={currentUser} createComment={createComment} postId={postId} />
    </div>
  }
}

export function ShowMore ({commentsLength, total, hasMore, fetchComments}) {
  if (!hasMore) return null

  const extra = total - 3

  return <div styleName='showMore' onClick={fetchComments}>
    View {extra} previous comment{extra > 1 ? 's' : ''}
  </div>
}
