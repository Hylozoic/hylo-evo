import React from 'react'
import Loading from 'components/Loading'
import PostCard from 'components/PostCard'
import './MemberVotes.scss'

export default class MemberVotes extends React.Component {
  componentDidMount () {
    this.props.fetchMemberVotes(this.props.personId)
  }

  itemSelected = selectedItemId => selectedItemId === this.props.postId

  render () {
    if (this.props.loading) return <Loading />

    const {
      posts,
      showDetails,
      editPost,
      voteOnPost
    } = this.props

    return <div>
      {posts && posts.map(post =>
        <div styleName='activity-item' key={post.id}>
          <PostCard
            post={post}
            showDetails={showDetails}
            voteOnPost={voteOnPost}
            editPost={editPost}
            expanded={this.itemSelected(post.id)} />
        </div>
      )}
    </div>
  }
}
