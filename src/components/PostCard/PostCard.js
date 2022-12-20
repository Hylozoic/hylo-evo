import cx from 'classnames'
import { get } from 'lodash/fp'
import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import CardImageAttachments from 'components/CardImageAttachments'
import { POST_PROP_TYPES } from 'store/models/Post'
import EventBody from './EventBody'
import PostBody from './PostBody'
import PostFooter from './PostFooter'
import PostHeader from './PostHeader'
import PostGroups from './PostGroups'

import './PostCard.scss'

export { PostHeader, PostFooter, PostBody, PostGroups, EventBody }

export default function PostCard (props) {
  const {
    className,
    constrained,
    currentUser,
    editPost,
    expanded,
    forwardedRef,
    highlightProps,
    intersectionObserver,
    post,
    respondToEvent,
    routeParams,
    showDetails
  } = props

  const postCardRef = forwardedRef || useRef()

  // TODO: dupe of clickcatcher?
  const shouldShowDetails = useCallback(element => {
    if (element === postCardRef) return true
    if (
      element.tagName === 'A' ||
      element.tagName === 'LI' ||
      ['mention', 'topic'].includes(element.getAttribute('data-type'))
    ) return false

    const parent = element.parentElement

    if (parent) return shouldShowDetails(parent)
    return true
  })

  const onClick = useCallback(event => {
    if (shouldShowDetails(event.target)) showDetails()
  })

  if (intersectionObserver) {
    useEffect(() => {
      intersectionObserver.observe(postCardRef.current)
      return () => { intersectionObserver.disconnect() }
    })
  }

  const postType = get('type', post)
  const isEvent = postType === 'event'

  const hasImage = post.attachments.find(a => a.type === 'image') || false

  return (
    <div
      ref={postCardRef}
      styleName={cx('card', postType, { expanded }, { constrained })}
      className={className}
    >
      <div onClick={onClick}>
        <PostHeader
          {...post}
          routeParams={routeParams}
          highlightProps={highlightProps}
          editPost={editPost}
          constrained={constrained}
          hasImage={hasImage}
        />
      </div>
      <div onClick={onClick}>
        <CardImageAttachments attachments={post.attachments} />
      </div>
      {isEvent && (
        <div styleName='bodyWrapper'>
          <EventBody
            onClick={onClick}
            currentUser={currentUser}
            event={post}
            slug={routeParams.groupSlug}
            respondToEvent={respondToEvent}
            constrained={constrained}
          />
        </div>
      )}
      {!isEvent && (
        <div>
          <PostBody
            {...post}
            onClick={onClick}
            slug={routeParams.groupSlug}
            constrained={constrained}
            currentUser={currentUser}
          />
        </div>
      )}
      <div onClick={onClick}>
        <PostGroups
          isPublic={post.isPublic}
          groups={post.groups}
          slug={routeParams.groupSlug}
          constrained={constrained}
        />
      </div>
      <PostFooter
        {...post}
        onClick={onClick}
        constrained={constrained}
        currentUser={currentUser}
        postId={post.id}
      />
    </div>
  )
}

PostCard.propTypes = {
  routeParams: PropTypes.object,
  post: PropTypes.shape(POST_PROP_TYPES),
  editPost: PropTypes.func,
  showDetails: PropTypes.func,
  highlightProps: PropTypes.object,
  expanded: PropTypes.bool,
  constrained: PropTypes.bool,
  className: PropTypes.string
}

PostCard.defaultProps = {
  routeParams: {}
}
