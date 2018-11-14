import React from 'react'
import Loading from 'components/Loading'
import PostCard from 'components/PostCard'
import './MemberPosts.scss'

export default class MemberPosts extends React.Component {
  componentDidMount () {
    this.props.fetchMemberPosts(this.props.personId)
  }

  itemSelected = selectedItemId => selectedItemId === this.props.postId

  render () {
    if (this.props.loading) return <Loading />

    const { posts } = this.props

    return <div>
      {posts && posts.map(post =>
        <div styleName='activity-item' key={post.id}>
          <PostCard
            {...this.props}
            post={post}
            expanded={this.itemSelected(post.id)} />
        </div>
      )}
    </div>
  }
}
