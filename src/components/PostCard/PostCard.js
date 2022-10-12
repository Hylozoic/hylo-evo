import React from 'react'
import PropTypes from 'prop-types'
import { POST_PROP_TYPES } from 'store/models/Post'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import PostGroups from './PostGroups'
import CardImageAttachments from 'components/CardImageAttachments'
import PostBody from './PostBody'
import EventBody from './EventBody'
import './PostCard.scss'
import cx from 'classnames'
import { get } from 'lodash/fp'

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
      currentUser,
      routeParams,
      post,
      editPost,
      voteOnPost,
      highlightProps,
      expanded,
      constrained,
      className,
      respondToEvent,
      forwardedRef
    } = this.props

    const postType = get('type', post)
    const isEvent = get('type', post) === 'event'

    const firstAttachment = post.attachments[0] || 0
    const attachmentType = firstAttachment.type || 0
    const hasImage = attachmentType === 'image' || false

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
