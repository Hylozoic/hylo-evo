import { connect } from 'react-redux'
// import { get, find } from 'lodash/fp'
import { push } from 'connected-react-router'
import { removeCommunityFromUrl } from 'util/navigation' // editPostUrl,
import fetchCommunity from 'store/actions/fetchCommunityById'
import getRouteParam from 'store/selectors/getRouteParam'
// import getPost from 'store/selectors/getPost'
// import presentPost from 'store/presenters/presentPost'
import getMe from 'store/selectors/getMe'
import getCommunity from 'store/selectors/getCommunity'
import { FETCH_COMMUNITY } from 'store/constants'

export function mapStateToProps (state, props) {
  const id = getRouteParam('communityId', state, props)
  const routeParams = props.match.params
  const community = getCommunity(state, props)
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
