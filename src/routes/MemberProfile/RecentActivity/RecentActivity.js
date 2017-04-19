import React from 'react'

import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import './RecentActivity.scss'

const { arrayOf, object } = React.PropTypes

export default class MemberProfile extends React.Component {
  static propTypes = {
    activityItems: arrayOf(object),
    comments: arrayOf(object),
    posts: arrayOf(object)
  }

  render () {
    const { activityItems } = this.props
    return <div>
      <h2 styleName='subhead'>Recent Activity</h2>
      {activityItems && activityItems.map((item, i) => {
        return <div styleName='activity-item' key={i}>
          {item.hasOwnProperty('title')
            ? <PostCard post={item} />
            : <CommentCard key={i} comment={item} />}
        </div>
      })}
    </div>
  }
}
