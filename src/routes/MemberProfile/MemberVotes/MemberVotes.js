import PropTypes from 'prop-types'
import React from 'react'

import PostCard from 'components/PostCard'
import './MemberVotes.scss'

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

export default class MemberVotes extends React.Component {
  static propTypes = {
    showDetails: func,
    votes: arrayOf(shape({
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
    }))
  }

  componentDidMount () {
    this.props.fetchMemberVotes(this.props.personId)
  }

  render () {
    const { showDetails, votes } = this.props
    return <div>
      {votes && votes.map(post =>
        <div styleName='activity-item' key={post.id}>
          <PostCard
            post={post}
            showDetails={() => showDetails(post.id, post.communities[0].slug)} />
        </div>
      )}
    </div>
  }
}
