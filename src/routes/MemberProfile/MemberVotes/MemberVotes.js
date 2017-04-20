import React from 'react'

import PostCard from 'components/PostCard'
import './MemberVotes.scss'

const { arrayOf, object } = React.PropTypes

export default class MemberVotes extends React.Component {
  static propTypes = {
    votes: arrayOf(object)
  }

  componentDidMount () {
    this.props.fetchMemberVotes(this.props.personId)
  }

  render () {
    const { votes } = this.props
    return <div>
      <h2 styleName='subhead'>Upvotes</h2>
      {votes && votes.map(post =>
        <div styleName='activity-item' key={post.id}>
          <PostCard post={post} />
        </div>
      )}
    </div>
  }
}
