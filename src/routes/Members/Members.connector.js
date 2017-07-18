import { connect } from 'react-redux'
import {
  FETCH_MEMBERS, fetchMembers, getMembers, getHasMoreMembers
} from './Members.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import { get } from 'lodash/fp'
import getQueryParam from 'store/selectors/getQueryParam'
import changeQueryParam from 'store/actions/changeQueryParam'

const defaultSortBy = 'name'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const network = getNetworkForCurrentRoute(state, props)
  const subject = community ? 'community' : 'network'
  const slug = get('slug', community || network)
  const sortBy = getQueryParam('s', state, props) || defaultSortBy
  const search = getQueryParam('q', state, props)
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
    canInvite: false, // TODO
    memberCount: get('memberCount', community || network),
    sortBy,
    search,
    members: getMembers(state, extraProps),
    hasMore: getHasMoreMembers(state, extraProps),
    pending: state.pending[FETCH_MEMBERS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchMembers: params => dispatch(fetchMembers(params)),
    changeSearch: term => dispatch(changeQueryParam(props, 'q', term)),
    changeSort: sort => dispatch(changeQueryParam(props, 's', sort, 'name'))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { subject, slug } = stateProps
  const params = getQueryParam(['s', 'q'], null, ownProps)
  var { s: sortBy = defaultSortBy, q: search } = params

  const fetchMembers = (offset = 0) => {
    return dispatchProps.fetchMembers({ subject, slug, sortBy, offset, search })
  }

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchMembers
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
