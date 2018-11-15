import React from 'react'
import Loading from 'components/Loading'
import CommentCard from 'components/CommentCard'
import './MemberComments.scss'

export default class MemberComments extends React.Component {
  componentDidMount () {
    this.props.fetchMemberComments()
  }

  itemSelected = selectedItemId => selectedItemId === this.props.routeParams.postId

  render () {
    if (this.props.loading) return <Loading />

    const { comments, showPostDetail, routeParams } = this.props

    return <div>
      {comments && comments.map(comment =>
        <div styleName='activity-item' key={comment.id}>
          <CommentCard
            routeParams={routeParams}
            comment={comment}
            showDetails={showPostDetail}
            expanded={this.itemSelected(comment.post.id)} />
        </div>
      )}
    </div>
  }
}
