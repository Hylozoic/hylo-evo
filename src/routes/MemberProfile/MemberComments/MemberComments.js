import React from 'react'

import CommentCard from 'components/CommentCard'
import './MemberComments.scss'

const { arrayOf, object } = React.PropTypes

export default class MemberProfile extends React.Component {
  static propTypes = {
    comments: arrayOf(object)
  }

  componentDidMount () {
    this.props.fetchMemberComments(this.props.personId)
  }

  render () {
    const { comments } = this.props
    return <div>
      <h2 styleName='subhead'>Comments</h2>
      {comments && comments.map(comment =>
        <div styleName='activity-item' key={comment.id}>
          <CommentCard comment={comment} />
        </div>
      )}
    </div>
  }
}
