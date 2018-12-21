import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import getRouteParam from 'store/selectors/getRouteParam'
import {
  setSearch,
  setSort,
  getSearch,
  getSort,
  getNetwork,
  fetchNetwork
} from './NetworkCommunities.store'
import {
  fetchCommunities,
  getCommunities,
  getCommunitiesTotal
} from 'routes/NetworkSettings/NetworkSettings.store'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('networkSlug', state, props)
  const search = getSearch(state, props)
  const sortBy = getSort(state, props)
  const queryProps = {slug, sortBy, search}
  return {
    network: getNetwork(state, {slug}),
    communities: getCommunities(state, queryProps),
    communitiesTotal: getCommunitiesTotal(state, queryProps),
    search,
    sortBy,
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNetwork: (slug, sortBy) => () => dispatch(fetchNetwork(slug, sortBy)),
    fetchCommunities: (opts) => () =>
      dispatch(fetchCommunities({...opts, pageSize: 20})),
    ...bindActionCreators({
      setSearch,
      setSort
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { slug, communities, sortBy, search } = stateProps
  const { fetchNetwork, fetchCommunities } = dispatchProps

  const fetchMoreCommunities =
    fetchCommunities({slug, offset: communities.length, sortBy, search})

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchNetwork: fetchNetwork(slug, sortBy),
    fetchMoreCommunities
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
