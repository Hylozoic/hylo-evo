import React from 'react'

import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import './RecentActivity.scss'

const { any, arrayOf, number, shape, string } = React.PropTypes

const personShape = shape({
  id: any,
  name: string,
  avatarUrl: string
})
const communityShape = shape({
  id: any,
  name: string,
  slug: string
})
const postShape = shape({
  id: any,
  title: string
})

export default class RecentActivity extends React.Component {
  static propTypes = {
    // Can be a comment or a post
    activityItems: arrayOf(shape({
      id: any,
      commenters: arrayOf(personShape),
      communities: arrayOf(communityShape),
      commentersTotal: number,
      creator: personShape,
      createdAt: string,
      details: string,
      followers: arrayOf(personShape),
      post: postShape,
      text: string,
      title: string,
      type: string
    }))
  }

  componentDidMount () {
    this.props.fetchRecentActivity(this.props.personId)
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
