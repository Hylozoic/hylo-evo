import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl, editPostUrl } from 'util/navigation'
import voteOnPost from 'store/actions/voteOnPost'
import { activitySelector, fetchRecentActivity } from './RecentActivity.store'

export function mapStateToProps (state, props) {
  return {
    activityItems: activitySelector(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchRecentActivity: () => dispatch(fetchRecentActivity(props.personId)),
    showDetails: postId => dispatch(push(postUrl(postId, props))),
    editPost: postId => dispatch(push(editPostUrl(postId, props))),
    voteOnPost: (postId, myVote) => dispatch(voteOnPost(postId, myVote))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
