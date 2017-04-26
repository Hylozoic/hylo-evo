import { connect } from 'react-redux'
import {
  fetchCommunity
} from './CommunitySidebar.store'
import getParam from 'store/selectors/getParam'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const members = community ? community.members.toModelArray() : []
  const leaders = community ? community.moderators.toModelArray() : []
  return {
    community: community ? community.ref : null,
    members,
    leaders,
    slug: getParam('slug', state, props)
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
