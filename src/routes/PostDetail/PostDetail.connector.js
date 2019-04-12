import { connect } from 'react-redux'
import { get, find } from 'lodash/fp'
import { push } from 'react-router-redux'
import { editPostUrl, removePostFromUrl } from 'util/navigation'
import fetchPost from 'store/actions/fetchPost'
import getRouteParam from 'store/selectors/getRouteParam'
import getPost from 'store/selectors/getPost'
import presentPost from 'store/presenters/presentPost'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import voteOnPost from 'store/actions/voteOnPost'
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
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const post = presentPost(getPost(state, props), get('id', currentCommunity))
  const currentUser = getMe(state)
  const isProjectMember = find(({id}) => id === get('id', currentUser), get('members', post))

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
    voteOnPost: (myVote) => dispatch(voteOnPost(postId, myVote)),
    processStripeToken: (postId, token, amount) => dispatch(processStripeToken(postId, token, amount)),
    respondToEvent: response => dispatch(respondToEvent(postId, response))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { post } = stateProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    voteOnPost: () =>
        dispatchProps.voteOnPost(!post.myVote)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
