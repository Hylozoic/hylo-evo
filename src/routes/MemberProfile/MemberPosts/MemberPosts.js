import React from 'react'

import PostCard from 'components/PostCard'
import './MemberPosts.scss'

const { any, arrayOf, func, number, shape, string } = React.PropTypes

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

export default class MemberPosts extends React.Component {
  static propTypes = {
    posts: arrayOf(shape({
      id: any,
      commenters: arrayOf(personShape),
      communities: arrayOf(communityShape),
      commentersTotal: number,
      creator: personShape,
      createdAt: string,
      details: string,
      followers: arrayOf(personShape),
      title: string,
      type: string
    })),
    showDetails: func
  }

  componentDidMount () {
    this.props.fetchMemberPosts(this.props.personId)
  }

  render () {
    const { posts, showDetails } = this.props
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
