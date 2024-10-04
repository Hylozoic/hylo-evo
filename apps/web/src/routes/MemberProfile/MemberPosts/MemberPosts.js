import React from 'react'
import Loading from 'components/Loading'
import PostCard from 'components/PostCard'
import classes from './MemberPosts.module.scss'

export default class MemberPosts extends React.Component {
  static defaultProps = {
    routeParams: {}
  }

  componentDidMount () {
    this.props.fetchMemberPosts()
  }

  itemSelected = selectedItemId => selectedItemId === this.props.routeParams.postId

  render () {
    if (this.props.loading) return <Loading />

    const { posts, routeParams } = this.props

    return <div>
      {posts && posts.map(post =>
        <div className={classes.activityItem} key={post.id}>
          <PostCard
            routeParams={routeParams}
            post={post}
            expanded={this.itemSelected(post.id)} />
        </div>
      )}
    </div>
  }
}
