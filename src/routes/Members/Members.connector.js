import { connect } from 'react-redux'
import {
  FETCH_MEMBERS, fetchMembers, getMembers, getHasMoreMembers
} from './Members.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { get } from 'lodash/fp'
import getQueryParam from 'store/selectors/getQueryParam'
import changeQueryParam from 'store/actions/changeQueryParam'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const sortBy = getQueryParam('s', state, props) || defaultSortBy
  const search = getQueryParam('q', state, props)

  const extraProps = {
    ...props,
    search,
    sortBy,
    slug: get('slug', community)
  }

  return {
    canInvite: false, // TODO
    memberCount: get('memberCount', community),
    sortBy,
    search,
    members: getMembers(state, extraProps),
    hasMore: getHasMoreMembers(state, extraProps),
    pending: state.pending[FETCH_MEMBERS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { slug } = props.match.params
  const params = getQueryParam(['s', 'q'], null, props)
  var { s: sortBy = defaultSortBy, q: search } = params

  return {
    fetchMembers: (offset = 0) =>
      dispatch(fetchMembers(slug, sortBy, offset, search)),
    changeSearch: term => dispatch(changeQueryParam(props, 'q', term)),
    changeSort: sort => dispatch(changeQueryParam(props, 's', sort, 'name'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)

const defaultSortBy = 'name'
