import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getSearch,
  getSort,
  setSearch,
  setSort,
  getChildGroups,
  getParentGroups
} from './RelatedGroupsTab.store'

export function mapStateToProps (state, props) {
  const slug = props.group.slug
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
