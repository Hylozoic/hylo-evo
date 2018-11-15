import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl, editPostUrl } from 'util/navigation'
import voteOnPost from 'store/actions/voteOnPost'

export function mapStateToProps (state, props) {
  return {}
}

export function mapDispatchToProps (dispatch, props) {
  const { post, routeParams, querystringParams } = props

  console.log('!!! editPostUrl',
    editPostUrl(post.id, routeParams, querystringParams),
    post.id,
    routeParams,
    querystringParams
  )

  return {
    showDetails: () => dispatch(push(postUrl(post.id, routeParams, querystringParams))),
    editPost: () => dispatch(push(editPostUrl(post.id, routeParams, querystringParams))),
    voteOnPost: () => dispatch(voteOnPost(post.id, !post.myVote))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
