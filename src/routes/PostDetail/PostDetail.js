import React, { PropTypes, Component } from 'react'
import './PostDetail.scss'
const { object } = PropTypes
import { PostHeader, PostFooter } from 'components/PostCard/component'

export default class PostDetail extends Component {
  static propTypes = {
    post: object,
    match: object
  }

  render () {
    const { post, match: { params: { postId } } } = this.props
    return <div styleName='post'>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        context={post.context}
        communities={post.communities} />
      <div>PostId: {postId}</div>
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal} />
    </div>
  }
}
