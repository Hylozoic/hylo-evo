import React, { PropTypes, Component } from 'react'
import Comment from './Comment'
import CommentForm from './CommentForm'
import PeopleTyping from 'components/PeopleTyping'
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
    const { comments, total, hasMore, fetchComments, currentUser, createComment, slug } = this.props
    return <div styleName='comments'>
      <ShowMore
        commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={fetchComments} />
      {comments.map(c => <Comment comment={c} key={c.id} slug={slug} />)}
      <div styleName='form-wrapper'>
        <CommentForm currentUser={currentUser} createComment={createComment} />
        <PeopleTyping styleName='people-typing' />
      </div>
    </div>
  }
}

export function ShowMore ({commentsLength, total, hasMore, fetchComments}) {
  if (!hasMore) return null

  const extra = total - 10

  return <div styleName='showMore' onClick={fetchComments}>
    View {extra} previous comment{extra > 1 ? 's' : ''}
  </div>
}
