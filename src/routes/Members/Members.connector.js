import { connect } from 'react-redux'
import {
  FETCH_MEMBERS, fetchMembers, getMembers, getHasMoreMembers
} from './Members.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import { get } from 'lodash/fp'
import getQueryParam from 'store/selectors/getQueryParam'
import changeQueryParam from 'store/actions/changeQueryParam'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const network = getNetworkForCurrentRoute(state, props)
  const getSlug = get('slug')
  const slug = getSlug(community || network)
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
    slug,
    canInvite: false, // TODO
    network,
    memberCount: community ? get('memberCount', community) : get('memberCount', network),
    sortBy,
    search,
    members: getMembers(state, extraProps),
    hasMore: getHasMoreMembers(state, extraProps),
    pending: state.pending[FETCH_MEMBERS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  // const { network } = props
  // console.log(props)
  const { networkSlug } = props.match.params
  const params = getQueryParam(['s', 'q'], null, props)
  var { s: sortBy = defaultSortBy, q: search } = params
  return {
    fetchMembers: (offset = 0) =>
      dispatch(fetchMembers({ subject: 'network', slug: networkSlug, sortBy, offset, search })),
    changeSearch: term => dispatch(changeQueryParam(props, 'q', term)),
    changeSort: sort => dispatch(changeQueryParam(props, 's', sort, 'name'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)

const defaultSortBy = 'name'
