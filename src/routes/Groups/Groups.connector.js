import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getRouteParam from 'store/selectors/getRouteParam'
import {
  getSearch,
  getSort,
  setSearch,
  setSort
} from './Groups.store'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)
  const groupSlug = getRouteParam('groupSlug', state, props)
  const search = getSearch(state, props)
  const sortBy = getSort(state, props)
  const queryProps = { groupSlug, sortBy, search }

  return {
    group,
    childGroups: getChildGroups(state, queryProps),
    parentGroups: getParentGroups(state, queryProps),
    search,
    sortBy,
    groupSlug
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      setSearch,
      setSort
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  // const { slug, groups, sortBy, search } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
