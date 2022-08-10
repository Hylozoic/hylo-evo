import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { postUrl, editPostUrl } from 'util/navigation'
import voteOnPost from 'store/actions/voteOnPost'
import respondToEvent from 'store/actions/respondToEvent'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)

  return {
    currentUser
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { locationParams, post, routeParams, querystringParams } = props
  const url = postUrl(post.id, routeParams, { ...locationParams, ...querystringParams })
  return {
    showDetails: () => dispatch(push(url)),
    postUrl: url,
    editPost: () => dispatch(push(editPostUrl(post.id, routeParams, querystringParams))),
    voteOnPost: () => dispatch(voteOnPost(post.id, !post.myVote)),
    respondToEvent: response => dispatch(respondToEvent(post.id, response))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
