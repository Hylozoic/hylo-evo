import { connect } from 'react-redux'
import { get, find } from 'lodash/fp'
import { push } from 'redux-first-history'
import { editPostUrl, removePostFromUrl } from 'util/navigation'
import fetchPost from 'store/actions/fetchPost'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import processStripeToken from 'store/actions/processStripeToken'
import respondToEvent from 'store/actions/respondToEvent'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'
import { FETCH_POST } from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import getRouteParam from 'store/selectors/getRouteParam'

// TODO remove

export function mapStateToProps (state, props) {
  // match params
  const id = getRouteParam('postId', props)
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
    currentGroup,
    currentUser,
    isProjectMember,
    pending: state.pending[FETCH_POST]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props
  const postId = getRouteParam('postId', props)
  const closeLocation = {
    ...props.location,
    pathname: removePostFromUrl(location.pathname) || '/'
  }

  return {
    fetchPost: () => dispatch(fetchPost(postId)),
    editPost: () => dispatch(push(editPostUrl(postId, props.match.params))),
    onClose: () => dispatch(push(closeLocation)),
    joinProject: () => dispatch(joinProject(postId)),
    leaveProject: () => dispatch(leaveProject(postId)),
    processStripeToken: (postId, token, amount) => dispatch(processStripeToken(postId, token, amount)),
    respondToEvent: (post, response) => dispatch(respondToEvent(post, response)),
    trackAnalyticsEvent: (name, data) => dispatch(trackAnalyticsEvent(name, data))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { post } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    respondToEvent: (response) => dispatchProps.respondToEvent(post, response)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
