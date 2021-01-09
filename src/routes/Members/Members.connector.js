import { connect } from 'react-redux'
import {
  FETCH_MEMBERS, fetchMembers, getMembers, getHasMoreMembers, removeMember
} from './Members.store'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { get } from 'lodash/fp'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'

const defaultSortBy = 'name'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)
  const slug = getRouteParam('slug', state, props)
  const sortBy = getQuerystringParam('s', state, props) || defaultSortBy
  const search = getQuerystringParam('q', state, props)
  const canModerate = group && getMe(state, props).canModerate(group)
  const extraProps = {
    ...props,
    slug,
    search,
    sortBy
  }
  return {
    slug,
    memberCount: get('memberCount', group),
    sortBy,
    search,
    canModerate,
    group,
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
    removeMember: (personId, groupId) => dispatch(removeMember(personId, groupId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { slug } = stateProps
  const params = getQuerystringParam(['s', 'q'], null, ownProps)
  var { s: sortBy = defaultSortBy, q: search } = params

  const removeMember = (id) => dispatchProps.removeMember(id, stateProps.group.id)
  const fetchMembers = (offset = 0) =>
    dispatchProps.fetchMembers({ slug, sortBy, offset, search })

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    removeMember,
    fetchMembers
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
