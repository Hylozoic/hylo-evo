import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash/fp'
import './PostDetail.scss'
const { object, string, func } = PropTypes
import { PostHeader, PostImage, PostBody, PostFooter } from 'components/PostCard/component'
import Comments from './Comments'
import { tagUrl, communityUrl } from 'util/index'

export default class PostDetail extends Component {
  static propTypes = {
    post: object,
    slug: string,
    fetchPost: func,
    navigate: func
  }

  componentDidMount () {
    this.props.fetchPost()
  }

  render () {
    const { post, slug, navigate } = this.props
    if (!post) return null

    return <div styleName='post'>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        context={post.context}
        communities={post.communities}
        close={() => navigate(communityUrl(slug))}
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
      <Comments postId={post.id} slug={slug} />
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
