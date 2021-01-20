import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getRouteParam from 'store/selectors/getRouteParam'
import {
  getSearch,
  getSort,
  setSearch,
  setSort
} from './Groups.store'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('slug', state, props)
  const search = getSearch(state, props)
  const sortBy = getSort(state, props)
  const queryProps = { slug, sortBy, search }

  return {
    parentGroups: getParentGroups(state, queryProps),
    childGroups: getChildGroups(state, queryProps),
    search,
    sortBy,
    slug
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
