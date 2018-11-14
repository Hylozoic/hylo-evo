import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl, editPostUrl } from 'util/navigation'
import voteOnPost from 'store/actions/voteOnPost'

export function mapStateToProps (state, props) {
  return {}
}

export function mapDispatchToProps (dispatch, props) {
  const { post } = props
  return {
    showDetails: () => dispatch(push(postUrl(post.id, props))),
    editPost: () => dispatch(push(editPostUrl(post.id, props))),
    voteOnPost: () => dispatch(voteOnPost(post.id, !post.myVote))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
