import { connect } from 'react-redux'
import {
  FETCH_MEMBERS, fetchMembers, getMembers, getHasMoreMembers, removeMember
} from './Members.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import { get } from 'lodash/fp'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'

const defaultSortBy = 'name'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const network = getNetworkForCurrentRoute(state, props)
  const communitySlug = getParam('slug', state, props)
  const networkSlug = getParam('networkSlug', state, props)
  const subject = networkSlug ? 'network' : 'community'
  const slug = communitySlug || networkSlug
  const sortBy = getQuerystringParam('s', state, props) || defaultSortBy
  const search = getQuerystringParam('q', state, props)
  const canModerate = community && getMe(state, props).canModerate(community)
  const extraProps = {
    ...props,
    network,
    slug,
    search,
    sortBy
  }
  return {
    subject,
    slug,
    memberCount: get('memberCount', community || network),
    sortBy,
    search,
    canModerate,
    community,
    members: getMembers(state, extraProps),
    hasMore: getHasMoreMembers(state, extraProps),
    pending: state.pending[FETCH_MEMBERS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchMembers: params => dispatch(fetchMembers(params)),
    changeSearch: term => dispatch(changeQuerystringParam(props, 'q', term)),
    changeSort: sort => dispatch(changeQuerystringParam(props, 's', sort, 'name')),
    removeMember: (personId, communityId) => dispatch(removeMember(personId, communityId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { subject, slug } = stateProps
  const params = getQuerystringParam(['s', 'q'], null, ownProps)
  var { s: sortBy = defaultSortBy, q: search } = params

  const removeMember = (id) => dispatchProps.removeMember(id, stateProps.community.id)
  const fetchMembers = (offset = 0) =>
    dispatchProps.fetchMembers({ subject, slug, sortBy, offset, search })

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    removeMember,
    fetchMembers
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
