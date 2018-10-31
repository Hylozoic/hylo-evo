import PropTypes from 'prop-types'
import React from 'react'
import { get } from 'lodash/fp'
import PostCard from 'components/PostCard'
import './MemberPosts.scss'

const { any, arrayOf, func, number, shape, string } = PropTypes

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
    personId: string,
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
    showDetails: func,
    editPost: func
  }

  componentDidMount () {
    this.props.fetchMemberPosts(this.props.personId)
  }

  render () {
    const { personId, posts, selectedPostId, showDetails, editPost, voteOnPost } = this.props

    return <div>
      {posts && posts.map(post => {
        const slug = get('communities.0.slug', post)

        return <div styleName='activity-item' key={post.id}>
          <PostCard
            post={post}
            expanded={post.id === selectedPostId}
            voteOnPost={voteOnPost}
            showDetails={postId => showDetails(postId, {slug, personId})}
            editPost={postId => editPost(postId, {slug, personId})} />
        </div>
      }

      )}
    </div>
  }
}
