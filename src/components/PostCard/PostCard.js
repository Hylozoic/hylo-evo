import React from 'react'
import PropTypes from 'prop-types'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import PostCommunities from './PostCommunities'
import PostImage from './PostImage'
import PostBody from './PostBody'
import './PostCard.scss'
import samplePost from './samplePost'
import cx from 'classnames'

export { PostHeader, PostFooter, PostImage, PostBody, PostCommunities }

const { shape, any, object, string, func, array, bool } = PropTypes

export default class PostCard extends React.Component {
  static propTypes = {
    post: shape({
      id: any,
      type: string,
      creator: object,
      name: string,
      details: string,
      commenters: array,
      upVotes: string,
      updatedAt: string
    }),
    fetchPost: func,
    expanded: bool,
    showDetails: func
  }

  static defaultProps = {
    post: samplePost()
  }

  render () {
    const {
      post, className, expanded, showDetails, highlightProps, slug
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

      if (shouldShowDetails(target)) showDetails()
    }

    return <div ref='postCard' styleName={cx('card', {expanded})} className={className}
      onClick={onClick}>
      <PostHeader creator={post.creator}
        date={post.createdAt}
        type={post.type}
        communities={post.communities}
        slug={slug}
        id={post.id}
        pinned={post.pinned}
        topics={post.topics}
        highlightProps={highlightProps}
        announcement={post.announcement} />
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
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote}
        type={post.type}
        members={post.members || []} />
    </div>
  }
}
