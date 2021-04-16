import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { postUrl } from 'util/navigation'
import voteOnPost from 'store/actions/voteOnPost'

export function mapDispatchToProps (dispatch, props) {
  const { post, routeParams, querystringParams } = props

  return {
    showDetails: () => dispatch(push(postUrl(post.id, routeParams, querystringParams))),
    voteOnPost: () => dispatch(voteOnPost(post.id, !post.myVote))
  }
}

export default connect(() => ({}), mapDispatchToProps)
