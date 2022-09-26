import { connect } from 'react-redux'
import { get, find } from 'lodash/fp'
import { push } from 'connected-react-router'
import { editPostUrl, removePostFromUrl } from 'util/navigation'
import fetchPost from 'store/actions/fetchPost'
import getRouteParam from 'store/selectors/getRouteParam'
import getPost from 'store/selectors/getPost'
import presentPost from 'store/presenters/presentPost'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import reactOnPost from 'store/actions/reactOnPost'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import processStripeToken from 'store/actions/processStripeToken'
import respondToEvent from 'store/actions/respondToEvent'
import { FETCH_POST } from 'store/constants'

export function mapStateToProps (state, props) {
  // match params
  const id = getRouteParam('postId', state, props)
  const routeParams = props.match.params
  // everything else
  const currentGroup = getGroupForCurrentRoute(state, props)
  const post = presentPost(getPost(state, props), get('id', currentGroup))
  const currentUser = getMe(state)
  const isProjectMember = find(({ id }) => id === get('id', currentUser), get('members', post))

  return {
    id,
    routeParams,
    post,
    currentUser,
    isProjectMember,
    pending: state.pending[FETCH_POST]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props
  const postId = getRouteParam('postId', {}, props)
  const closeLocation = {
    ...props.location,
    pathname: removePostFromUrl(location.pathname)
  }

  return {
    fetchPost: () => dispatch(fetchPost(postId)),
    editPost: () => dispatch(push(editPostUrl(postId, props.match.params))),
    onClose: () => dispatch(push(closeLocation)),
    joinProject: () => dispatch(joinProject(postId)),
    leaveProject: () => dispatch(leaveProject(postId)),
    reactOnPost: emojiFull => dispatch(reactOnPost(postId, emojiFull)),
    processStripeToken: (postId, token, amount) => dispatch(processStripeToken(postId, token, amount)),
    respondToEvent: response => dispatch(respondToEvent(postId, response))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    reactOnPost: (postId, emojiFull) =>
      dispatchProps.reactOnPost(postId, emojiFull)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
