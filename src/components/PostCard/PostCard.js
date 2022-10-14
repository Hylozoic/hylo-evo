import cx from 'classnames'
import { get } from 'lodash/fp'
import React from 'react'
import PropTypes from 'prop-types'
import CardImageAttachments from 'components/CardImageAttachments'
import { POST_PROP_TYPES } from 'store/models/Post'
import ChatCard from './ChatCard'
import EventBody from './EventBody'
import PostBody from './PostBody'
import PostFooter from './PostFooter'
import PostHeader from './PostHeader'
import PostGroups from './PostGroups'

import './PostCard.scss'

export { PostHeader, PostFooter, PostBody, PostGroups, EventBody }

export default class PostCard extends React.Component {
  static propTypes = {
    routeParams: PropTypes.object,
    post: PropTypes.shape(POST_PROP_TYPES),
    editPost: PropTypes.func,
    showDetails: PropTypes.func,
    voteOnPost: PropTypes.func,
    highlightProps: PropTypes.object,
    expanded: PropTypes.bool,
    constrained: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    routeParams: {}
  }

  // TODO: dupe of clickcatcher?
  shouldShowDetails = element => {
    if (element === this.props.forwardedRef || this.element === this.refs.postCard) return true
    if (
      element.tagName === 'A' ||
      element.tagName === 'LI' ||
      ['mention', 'topic'].includes(element.getAttribute('data-type'))
    ) return false

    const parent = element.parentElement

    if (parent) return this.shouldShowDetails(parent)
    return true
  }

  onClick = event => {
    if (this.shouldShowDetails(event.target)) this.props.showDetails()
  }

  render () {
    const {
      className,
      constrained,
      currentUser,
      editPost,
      expanded,
      forwardedRef,
      highlightProps,
      post,
      respondToEvent,
      routeParams,
      showDetails,
      voteOnPost
    } = this.props

    const postType = get('type', post)
    const isEvent = postType === 'event'

    const hasImage = post.attachments.find(a => a.type === 'image') || false

    if (postType === 'chat') return (
      <ChatCard
        expanded={expanded}
        highlightProps={highlightProps}
        post={post}
        routeParams={routeParams}
        slug={routeParams.groupSlug}
        showDetails={showDetails}
      />
    )

    return (
      <div ref={forwardedRef || 'postCard'}
        onClick={!isEvent ? this.onClick : null}
        styleName={cx('card', postType, { expanded }, { constrained })}
        className={className}
      >
        <div onClick={isEvent ? this.onClick : null}>
          <PostHeader
            {...post}
            routeParams={routeParams}
            highlightProps={highlightProps}
            editPost={editPost}
            constrained={constrained}
            hasImage={hasImage}
          />
        </div>
        <div onClick={isEvent ? this.onClick : null}>
          <CardImageAttachments attachments={post.attachments} />
        </div>
        {isEvent && (
          <div styleName='bodyWrapper'>
            <div styleName='trigger' onClick={isEvent ? this.onClick : null} />
            <EventBody
              currentUser={currentUser}
              event={post}
              slug={routeParams.groupSlug}
              respondToEvent={respondToEvent}
              constrained={constrained}
            />
          </div>
        )}
        {!isEvent && (
          <PostBody
            {...post}
            slug={routeParams.groupSlug}
            constrained={constrained}
          />
        )}
        <PostGroups
          isPublic={post.isPublic}
          groups={post.groups}
          slug={routeParams.groupSlug}
          constrained={constrained}
        />

        <PostFooter
          {...post}
          onClick={this.onClick}
          voteOnPost={voteOnPost}
          constrained={constrained}
          currentUser={currentUser}
          postId={post.id}
        />
      </div>
    )
  }
}
