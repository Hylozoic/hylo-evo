import { array, func, object, number, string } from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import scrollIntoView from 'scroll-into-view-if-needed'
import ShowMore from './ShowMore'
import Comment from './Comment'
import CommentForm from './CommentForm'
import PeopleTyping from 'components/PeopleTyping'
import { inIframe } from 'util/index'

import './Comments.scss'

export default class Comments extends Component {
  static propTypes = {
    comments: array,
    commentsPending: object,
    selectedCommentId: string,
    commentsTotal: number,
    fetchComments: func,
    height: number,
    createComment: func,
    currentUser: object,
    post: object,
    slug: string,
    width: number
  }

  static defaultProps = {
    comments: []
  }

  componentDidMount () {
    this.ensureSelectedCommentPresent()
  }

  componentDidUpdate (prevProps) {
    if (this.props.selectedCommentId !== prevProps.selectedCommentId) {
      this.ensureSelectedCommentPresent()
    }
  }

  ensureSelectedCommentPresent () {
    const { comments, commentsPending, selectedCommentId } = this.props
    if (selectedCommentId && comments.length > 0) {
      const commentIds = []
      comments.forEach(comment => {
        commentIds.push(comment.id)
        comment.childComments.forEach(comment => commentIds.push(comment.id))
      })
      if (!commentsPending && !commentIds.includes(selectedCommentId.toString())) {
        this.props.fetchComments().then(() => this.forceUpdate())
      }
    }
  }

  scrollToReplyInput (elem) {
    scrollIntoView(elem, { behavior: 'smooth', scrollMode: 'if-needed' })
  }

  render () {
    const {
      comments,
      total,
      hasMore,
      fetchComments,
      currentUser,
      createComment,
      selectedCommentId,
      slug,
      post,
      width
    } = this.props

    const style = {
      width: width + 'px'
    }

    return (
      <div styleName='comments'>
        <ShowMore
          commentsLength={comments.length}
          total={total}
          hasMore={hasMore}
          fetchComments={fetchComments}
        />

        {comments.map(c => (
          <Comment
            key={c.id}
            comment={c}
            slug={slug}
            selectedCommentId={selectedCommentId}
            post={post}
            onReplyThread={this.scrollToReplyInput.bind(this)}
          />
        ))}
        {currentUser
          ? (
            <div styleName='form-wrapper' style={style}>
              <CommentForm
                currentUser={currentUser}
                createComment={createComment}
                postId={post.id}
              />
              <PeopleTyping styleName='people-typing' />
            </div>
          ) : (
            <Link
              to={`/login?returnToUrl=${encodeURIComponent(window.location.pathname)}`}
              target={inIframe() ? '_blank' : ''}
              styleName='signup-button'
            >
              Join Hylo to respond
            </Link>
          )
        }
      </div>
    )
  }
}
