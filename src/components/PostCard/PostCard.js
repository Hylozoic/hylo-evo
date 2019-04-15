import React from 'react'
import PropTypes from 'prop-types'
import { POST_PROP_TYPES } from 'store/models/Post'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import PostCommunities from './PostCommunities'
import PostImage from './PostImage'
import PostBody from './PostBody'
import EventBody from './EventBody'
import './PostCard.scss'
import samplePost from './samplePost'
import cx from 'classnames'
import { get } from 'lodash/fp'

export { PostHeader, PostFooter, PostImage, PostBody, PostCommunities, EventBody }

export default class PostCard extends React.Component {
  static propTypes = {
    routeParams: PropTypes.object,
    post: PropTypes.shape(POST_PROP_TYPES),
    editPost: PropTypes.func,
    showDetails: PropTypes.func,
    voteOnPost: PropTypes.func,
    highlightProps: PropTypes.object,
    expanded: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    post: samplePost(),
    routeParams: {}
  }

  shouldShowDetails = element => {
    if (element === this.refs.postCard) return true
    if (element.tagName === 'A' || element.tagName === 'LI') return false
    const parent = element.parentElement
    if (parent) return this.shouldShowDetails(parent)
    return true
  }

  onClick = event => {
    if (this.shouldShowDetails(event.target)) this.props.showDetails()
  }

  render () {
    const {
      routeParams,
      post,
      editPost,
      voteOnPost,
      highlightProps,
      expanded,
      className,
      respondToEvent
    } = this.props

    const isEvent = get('type', post) === 'event'

    return <div ref='postCard'
      onClick={this.onClick}
      styleName={cx('card', {expanded})}
      className={className}>
      <PostHeader
        {...post}
        routeParams={routeParams}
        highlightProps={highlightProps}
        editPost={editPost} />
      <PostImage styleName='image' postId={post.id} />
      {isEvent && <EventBody event={post} slug={routeParams.slug} respondToEvent={respondToEvent} />}
      {!isEvent && <PostBody post={post} slug={routeParams.slug} />}            
      <PostCommunities communities={post.communities} slug={routeParams.slug} />
      <PostFooter {...post} voteOnPost={voteOnPost} />
    </div>
  }
}
