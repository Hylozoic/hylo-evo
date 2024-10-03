import React from 'react'
import Loading from 'components/Loading'
import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import classes from './RecentActivity.module.scss'

export default class RecentActivity extends React.Component {
  static defaultProps = {
    routeParams: {}
  }

  componentDidMount () {
    this.props.fetchRecentActivity()
  }

  itemSelected = selectedItemId => selectedItemId === this.props.routeParams.postId

  render () {
    if (this.props.loading) return <Loading />

    const { activityItems, routeParams } = this.props

    return <div>
      {activityItems && activityItems.map((item, i) =>
        <div className={classes.activityItem} key={i}>
          {item.hasOwnProperty('title')
            ? <PostCard
              post={item}
              routeParams={routeParams}
              expanded={this.itemSelected(item.id)} />
            : <CommentCard
              comment={item}
              routeParams={routeParams}
              expanded={this.itemSelected(item.post.id)} />}
        </div>
      )}
    </div>
  }
}
