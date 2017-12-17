import PropTypes from 'prop-types'
import React from 'react'

import CommentCard from 'components/CommentCard'
import './MemberComments.scss'

const { any, arrayOf, shape, string } = PropTypes

const personShape = shape({
  id: any,
  name: string,
  avatarUrl: string
})

export default class MemberComments extends React.Component {
  static propTypes = {
    comments: arrayOf(shape({
      id: any,
      creator: personShape,
      createdAt: string,
      text: string
    }))
  }

  componentDidMount () {
    this.props.fetchMemberComments(this.props.personId)
  }

  render () {
    const { comments } = this.props
    return <div>
      {comments && comments.map(comment =>
        <div styleName='activity-item' key={comment.id}>
          <CommentCard comment={comment} />
        </div>
      )}
    </div>
  }
}
