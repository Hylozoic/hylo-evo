import React from 'react'
import Loading from 'components/Loading'
import PostCard from 'components/PostCard'
import './MemberVotes.scss'

export default class MemberVotes extends React.Component { // TODO REACTIONS: switch this to reactions
  static defaultProps = {
    routeParams: {}
  }

  componentDidMount () {
    this.props.fetchMemberVotes() // TODO REACTIONS: switch this to reactions
  }

  itemSelected = selectedItemId => selectedItemId === this.props.routeParams.postId

  render () {
    if (this.props.loading) return <Loading />

    const { posts, routeParams } = this.props

    return <div>
      {posts && posts.map(post =>
        <div styleName='activity-item' key={post.id}>
          <PostCard
            routeParams={routeParams}
            post={post}
            expanded={this.itemSelected(post.id)} />
        </div>
      )}
    </div>
  }
}
