import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import scrollIntoView from 'scroll-into-view-if-needed'
import ShowMore from './ShowMore'
import Comment from './Comment'
import CommentForm from './CommentForm'
import PeopleTyping from 'components/PeopleTyping'
import { inIframe } from 'util/index'

import './Comments.scss'

const { array, func, object, number, string } = PropTypes

export default class Comments extends Component {
  static propTypes = {
    comments: array,
    commentsTotal: number,
    fetchComments: func,
    height: number,
    createComment: func,
    currentUser: object,
    postId: string,
    slug: string,
    width: number
  }

  static defaultProps = {
    comments: []
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
      slug,
      postId,
      width
    } = this.props

    const style = {
      width: width + 'px'
    }

    return <div styleName='comments'>
      <ShowMore
        commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={fetchComments} />
      {comments.map(c => (
        <Comment
          key={c.id}
          comment={c}
          slug={slug}
          postId={postId}
          onReplyThread={this.scrollToReplyInput.bind(this)} />
      ))}
      {currentUser
        ? <div styleName='form-wrapper' style={style}>
          <CommentForm
            currentUser={currentUser}
            createComment={createComment}
            postId={postId}
          />
          <PeopleTyping styleName='people-typing' />
        </div>
        : <Link
          to={`/login?returnToUrl=${encodeURIComponent(window.location.pathname)}`}
          target={inIframe() ? '_blank' : ''}
          styleName='signup-button'
        >
          Sign up to comment
        </Link>
      }
    </div>
  }
}
