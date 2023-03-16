import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { postUrl, editPostUrl } from 'util/navigation'
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

  return {
    showDetails: () => dispatch(push(postUrl(post.id, routeParams, { ...locationParams, ...querystringParams }))),
    editPost: () => dispatch(push(editPostUrl(post.id, routeParams, querystringParams))),
    respondToEvent: response => dispatch(respondToEvent(post, response))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
