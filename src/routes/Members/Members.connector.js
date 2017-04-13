import { connect } from 'react-redux'
import {
  FETCH_MEMBERS, fetchMembers, getMembers, getHasMoreMembers
} from './Members.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const extraProps = {
    ...props,
    sortBy: 'name',
    slug: get('slug', community)
  }
  return {
    canInvite: true,
    memberCount: get('memberCount', community),
    sortBy: 'name',
    members: getMembers(state, extraProps),
    hasMore: getHasMoreMembers(state, extraProps),
    pending: state.pending[FETCH_MEMBERS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { slug } = props.match.params
  return {
    fetchMembers: (sortBy, offset) => dispatch(fetchMembers(slug, sortBy, offset))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
