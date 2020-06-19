import { connect } from 'react-redux'
// import { get, find } from 'lodash/fp'
import { push } from 'connected-react-router'
import { removeCommunityFromUrl } from 'util/navigation' // editPostUrl,
import fetchCommunity from 'store/actions/fetchForCommunity'
import getRouteParam from 'store/selectors/getRouteParam'
// import getPost from 'store/selectors/getPost'
// import presentPost from 'store/presenters/presentPost'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { FETCH_COMMUNITY } from 'store/constants'

export function mapStateToProps (state, props) {
  // match params
  const id = getRouteParam('communityId', state, props)
  const routeParams = props.match.params
  // everything else
  const community = getCommunityForCurrentRoute(state, props)
  // const community = getPost(state, props), get('id', currentCommunity)
  const currentUser = getMe(state)

  return {
    id,
    routeParams,
    community,
    currentUser,
    pending: state.pending[FETCH_COMMUNITY]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props
  console.log('\n COMMUNITY LOCATION', location)
  const communityId = getRouteParam('communityId', {}, props)
  const closeLocation = {
    ...props.location,
    pathname: removeCommunityFromUrl(location.pathname)
  }

  return {
    fetchCommunity: () => dispatch(fetchCommunity(communityId)),
    // editPost: () => dispatch(push(editPostUrl(postId, props.match.params))),
    onClose: () => dispatch(push(closeLocation))
    // joinProject: () => dispatch(joinProject(postId)),
    // leaveProject: () => dispatch(leaveProject(postId)),
    // voteOnPost: (myVote) => dispatch(voteOnPost(postId, myVote)),
    // processStripeToken: (postId, token, amount) => dispatch(processStripeToken(postId, token, amount)),
    // respondToEvent: response => dispatch(respondToEvent(postId, response))
  }
}

// export function mergeProps (stateProps, dispatchProps, ownProps) {
//   const { post } = stateProps
//
//   return {
//     ...ownProps,
//     ...stateProps,
//     ...dispatchProps
//   }
// }

export default connect(mapStateToProps, mapDispatchToProps)
