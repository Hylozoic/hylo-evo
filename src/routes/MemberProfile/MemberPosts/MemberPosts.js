import React from 'react'

import PostCard from 'components/PostCard'
import './MemberPosts.scss'

const { arrayOf, object } = React.PropTypes

export default class MemberProfile extends React.Component {
  static propTypes = {
    posts: arrayOf(object)
  }

  componentDidMount () {
    this.props.fetchMemberPosts(this.props.personId)
  }

  render () {
    const { posts } = this.props
    return <div>
      <h2 styleName='subhead'>Posts</h2>
      {posts && posts.map(post =>
        <div styleName='activity-item' key={post.id}>
          <PostCard post={post} />
        </div>
      )}
    </div>
  }
}
