import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import { isEmpty, get } from 'lodash/fp'
import './PostDetail.scss'
const { bool, func, object, string } = PropTypes
import { PostImage, PostBody, PostFooter } from 'components/PostCard'
import PostHeader from 'components/PostCard/PostHeader'
import Comments from './Comments'
import { tagUrl } from 'util/index'
import { DETAIL_COLUMN_ID } from 'util/scrolling'

export default class PostDetail extends Component {
  static propTypes = {
    post: object,
    slug: string,
    fetchPost: func,
    showCommunity: bool
  }

  componentDidMount () {
    this.props.fetchPost()
  }

  componentDidUpdate (prevProps) {
    if (get('post.id', this.props) !== get('post.id', prevProps)) {
      this.props.fetchPost()
    }
  }

  render () {
    const { post, slug, onClose, showCommunity } = this.props
    if (!post) return null

    const scrollToBottom = () => {
      const detail = document.getElementById(DETAIL_COLUMN_ID)
      detail.scrollTop = detail.scrollHeight
    }

    return <div styleName='post'>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        communities={post.communities}
        showCommunity={showCommunity}
        close={onClose}
        slug={slug}
        styleName='header' />
      <PostImage imageUrl={post.imageUrl} styleName='image' />
      <PostTags tags={post.tags} />
      <PostBody title={post.title}
        id={post.id}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        expanded
        styleName='body' />
      <div styleName='activity-header'>Activity</div>
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal} />
      <Comments postId={post.id} slug={slug} scrollToBottom={scrollToBottom} />
    </div>
  }
}

export function PostTags ({ tags, slug }) {
  if (isEmpty(tags)) return null

  return <div styleName='tags'>
    {tags.map(tag => <Link styleName='tag' to={tagUrl(tag, slug)} key={tag}>
      #{tag}
    </Link>)}
  </div>
}
