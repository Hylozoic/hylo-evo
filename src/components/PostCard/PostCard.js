import React from 'react'
import PropTypes from 'prop-types'
import { POST_PROP_TYPES } from 'store/models/Post'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import PostCommunities from './PostCommunities'
import PostImage from './PostImage'
import PostBody from './PostBody'
import './PostCard.scss'
import samplePost from './samplePost'
import cx from 'classnames'

export { PostHeader, PostFooter, PostImage, PostBody, PostCommunities }

export default class PostCard extends React.Component {
  static propTypes = {
    post: PropTypes.shape(POST_PROP_TYPES),
    className: PropTypes.string,
    expanded: PropTypes.bool,
    highlightProps: PropTypes.object,
    slug: PropTypes.string,
    networkSlug: PropTypes.string,
    postTypeContext: PropTypes.string,
    deletePost: PropTypes.func,
    removePost: PropTypes.func,
    pinPost: PropTypes.func
  }

  static defaultProps = {
    post: samplePost()
  }

  render () {
    const {
      post,
      className,
      expanded,
      highlightProps,
      // routeParams
      slug,
      networkSlug,
      postTypeContext,
      //
      showDetails,
      editPost,
      deletePost,
      removePost,
      voteOnPost,
      pinPost
    } = this.props
    const shouldShowDetails = element => {
      if (element === this.refs.postCard) return true
      if (element.tagName === 'A' || element.tagName === 'LI') return false

      const parent = element.parentElement
      if (parent) return shouldShowDetails(parent)

      return true
    }
    const onClick = event => {
      const { target } = event

      if (shouldShowDetails(target)) showDetails(post.id)
    }

    return <div ref='postCard'
      onClick={onClick}
      styleName={cx('card', {expanded})}
      className={className}>
      <PostHeader
        {...post}
        slug={slug}
        networkSlug={networkSlug}
        postTypeContext={postTypeContext}
        highlightProps={highlightProps}
        editPost={editPost}
        deletePost={deletePost}
        removePost={removePost}
        pinPost={pinPost} />
      <PostImage styleName='image' postId={post.id} />
      <PostBody {...post} slug={slug} />
      <PostCommunities communities={post.communities} slug={slug} />
      <PostFooter {...post} voteOnPost={voteOnPost} />
    </div>
  }
}
