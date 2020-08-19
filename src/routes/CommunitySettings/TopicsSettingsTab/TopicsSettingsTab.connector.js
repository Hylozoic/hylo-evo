import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import debounced from 'util/debounced'
// import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import isPendingFor from 'store/selectors/isPendingFor'
import fetchTopics, { fetchDefaultTopics } from 'store/actions/fetchTopics'
import { FETCH_TOPICS } from 'store/constants'
import {
  setSort,
  setSearch,
  getDefaultTopics,
  getTopics,
  getHasMoreTopics,
  getTotalTopics,
  getSort,
  getSearch,
  setCommunityTopicVisibility,
  setCommunityTopicIsDefault
} from './TopicsSettingsTab.store'
import { createTopic } from 'components/CreateTopic/CreateTopic.store'

export function mapStateToProps (state, props) {
  // const routeParams = get('match.params', props)
  const community = props.community
  // const network = getNetworkForCurrentRoute(state, props)
  const selectedSort = getSort(state)
  const search = getSearch(state)
  const fetchTopicsParams = {
    community,
    communitySlug: community.slug,
    // networkSlug: routeParams.networkSlug,
    sortBy: selectedSort,
    autocomplete: search
  }
  const topics = getTopics(state, fetchTopicsParams)
  const hasMore = getHasMoreTopics(state, fetchTopicsParams)
  const totalTopics = getTotalTopics(state, fetchTopicsParams)
  const fetchIsPending = isPendingFor(FETCH_TOPICS, state)
  const defaultTopics = getDefaultTopics(state, fetchTopicsParams)

  return {
    community,
    defaultTopics,
    selectedSort,
    search,
    fetchTopicsParams,
    topics,
    hasMore,
    totalTopics,
    fetchIsPending
  }
}

export const mapDispatchToProps = {
  setSort,
  setSearch,
  fetchDefaultTopics,
  fetchTopics,
  setCommunityTopicVisibility,
  setCommunityTopicIsDefault,
  createTopic
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    topics,
    hasMore,
    fetchIsPending,
    fetchTopicsParams
  } = stateProps
  const { fetchDefaultTopics, fetchTopics } = dispatchProps

  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    fetchDefaultTopics: () => fetchDefaultTopics({ ...fetchTopicsParams }),
    fetchTopics: () => debounced(
      fetchTopics, {
        ...fetchTopicsParams,
        first: 20
      }
    ),
    fetchMoreTopics: () => {
      !fetchIsPending && hasMore && debounced(
        fetchTopics, {
          ...fetchTopicsParams,
          offset: get('length', topics, 0),
          first: 10
        }
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
