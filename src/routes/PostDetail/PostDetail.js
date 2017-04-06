import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash/fp'
import './PostDetail.scss'
const { object, string } = PropTypes
import { PostHeader, PostFooter } from 'components/PostCard/component'
import { tagUrl } from 'util/index'

export default class PostDetail extends Component {
  static propTypes = {
    post: object,
    slug: string
  }

  render () {
    const { post } = this.props
    return <div styleName='post'>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        context={post.context}
        communities={post.communities}
        close={() => console.log('close')}
        styleName='header' />
      <PostTags tags={post.tags} />
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal} />
    </div>
  }
}

function PostTags ({ tags, slug }) {
  if (isEmpty(tags)) return null

  return <div styleName='tags'>
    {tags.map(tag => <Link styleName='tag' to={tagUrl(tag, slug)}>
      #{tag}
    </Link>)}
  </div>
}
