import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import scrollIntoView from 'scroll-into-view-if-needed'
import ShowMore from './ShowMore'
import Comment from './Comment'
import CommentForm from './CommentForm'
import PeopleTyping from 'components/PeopleTyping'
import { inIframe } from 'util/index'

import './Comments.scss'

const { array, bool, func, object, number, string } = PropTypes

export default function Comments(props) {
//  const scrollRef = useRef()
  // TODO: set to true if actually at bottom (height is smaller than viewport)
  //const [atBottom, setAtBottom] = useState(false)

  const scrollToReplyInput = (elem) => {
    scrollIntoView(elem, { behavior: 'smooth', scrollMode: 'if-needed' })
  }

  // const onScroll = () => {
  //   if (scrollRef.current) {
  //     const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
  //     console.log("scroll", scrollTop + clientHeight, scrollHeight)
  //     if (scrollTop + clientHeight === scrollHeight) {
  //       setAtBottom(true)
  //     } else {
  //       setAtBottom(false)
  //     }
  //   }
  // };

  // const handleScroll = (e) => {
  //   const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  //   if (bottom) { ... }
  // }

  const {
    atBottom,
    comments,
    total,
    hasMore,
    fetchComments,
    currentUser,
    createComment,
    slug,
    postId,
    width
  } = props

  return <div styleName={cx('comments', { 'at-bottom': atBottom })}>
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
      ? <div styleName={cx('form-wrapper', { 'at-bottom': atBottom })} style={style}>
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

Comments.propTypes = {
  atBottom: bool,
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

Comments.defaultProps = {
  comments: []
}
