import { connect } from 'react-redux'
import {
  fetchCommunity
} from './CommunitySidebar.store'
import getParam from 'store/selectors/getParam'
// TODO: make getMe correct
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const members = community ? community.members.toModelArray().slice(0, 8) : []
  const leaders = community ? community.moderators.toModelArray() : []
  const currentUser = getMe(state, props)
  return {
    community: community ? community.ref : null,
    members,
    leaders,
    slug: getParam('slug', state, props),
    currentUser: currentUser
      ? {
        ...currentUser,
        memberships: currentUser.memberships.toRefArray()
      }
      : null
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchCommunityMaker: slug => () => dispatch(fetchCommunity(slug))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { slug } = stateProps
  const { fetchCommunityMaker } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunity: slug ? fetchCommunityMaker(slug) : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
