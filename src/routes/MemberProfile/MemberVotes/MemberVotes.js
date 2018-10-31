import React from 'react'
import PostCard from 'components/PostCard'
import './MemberVotes.scss'

export default class MemberVotes extends React.Component {
  componentDidMount () {
    this.props.fetchMemberVotes(this.props.personId)
  }

  render () {
    const { showDetails, posts } = this.props

    return <div>
      {posts && posts.map(post =>
        <div styleName='activity-item' key={post.id}>
          <PostCard
            post={post}
            showDetails={() => showDetails(post.id, post.communities[0].slug)} />
        </div>
      )}
    </div>
  }
}
