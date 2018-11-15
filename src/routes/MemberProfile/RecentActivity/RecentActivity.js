import React from 'react'
import Loading from 'components/Loading'
import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import './RecentActivity.scss'

export default class RecentActivity extends React.Component {
  componentDidMount () {
    this.props.fetchRecentActivity()
  }

  itemSelected = selectedItemId => selectedItemId === this.props.postId

  render () {
    if (this.props.loading) return <Loading />

    const {
      activityItems,
      routeParams,
      showPostDetail
    } = this.props

    return <div>
      <h2 styleName='subhead'>Recent Activity</h2>
      {activityItems && activityItems.map((item, i) => {
        return <div styleName='activity-item' key={i}>
          {item.hasOwnProperty('title')
            ? <PostCard
              routeParams={routeParams}
              expanded={this.itemSelected(item.id)}
              post={item} />
            : <CommentCard
              routeParams={routeParams}
              comment={item}
              expanded={this.itemSelected(item.post.id)}
              showDetails={showPostDetail} />}
        </div>
      })}
    </div>
  }
}
