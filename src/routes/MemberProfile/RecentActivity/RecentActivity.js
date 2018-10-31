import React from 'react'
import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import './RecentActivity.scss'

export default class RecentActivity extends React.Component {
  componentDidMount () {
    this.props.fetchRecentActivity()
  }

  render () {
    const { activityItems, showDetails, editPost, voteOnPost } = this.props

    return <div>
      <h2 styleName='subhead'>Recent Activity</h2>
      {activityItems && activityItems.map((item, i) => {
        return <div styleName='activity-item' key={i}>
          {item.hasOwnProperty('title')
            ? <PostCard
              post={item}
              showDetails={showDetails}
              editPost={editPost}
              voteOnPost={voteOnPost}
              key={i} />
            : <CommentCard
              comment={item}
              key={i} />}
        </div>
      })}
    </div>
  }
}
