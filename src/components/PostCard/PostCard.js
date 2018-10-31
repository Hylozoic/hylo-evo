import React from 'react'
import { pick } from 'lodash/fp'
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
  static defaultProps = {
    post: samplePost()
  }

  render () {
    const {
      post, className, expanded, showDetails, highlightProps, slug, networkSlug, postTypeContext, voteOnPost
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
        slug={slug}
        networkSlug={networkSlug}
        postTypeContext={postTypeContext}
        date={post.createdAt}
        highlightProps={highlightProps}
        {...pick([
          'id',
          'type',
          'creator',
          'communities',
          'pinned',
          'topics',
          'announcement',
          'editPost'
        ], post)} />
      <PostImage postId={post.id} styleName='image' />
      <PostBody title={post.title}
        id={post.id}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        highlightProps={highlightProps}
        fileAttachments={post.fileAttachments} />
      <PostCommunities
        communities={post.communities}
        slug={slug} />
      <PostFooter
        postId={post.id}
        vote={voteOnPost}
        myVote={post.myVote}
        votesTotal={post.votesTotal}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        type={post.type}
        members={post.members} />
    </div>
  }
}
