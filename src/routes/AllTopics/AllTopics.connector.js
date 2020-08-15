import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import debounced from 'util/debounced'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import isPendingFor from 'store/selectors/isPendingFor'
import toggleCommunityTopicSubscribe from 'store/actions/toggleCommunityTopicSubscribe'
import fetchTopics from 'store/actions/fetchTopics'
import { FETCH_TOPICS } from 'store/constants'
import {
  setSort,
  setSearch,
  getTopics,
  getHasMoreTopics,
  getTotalTopics,
  getSort,
  getSearch,
  deleteCommunityTopic
} from './AllTopics.store'

export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const community = getCommunityForCurrentRoute(state, props)
  const network = getNetworkForCurrentRoute(state, props)
  const selectedSort = getSort(state)
  const search = getSearch(state)
  const fetchTopicsParams = {
    communitySlug: routeParams.slug,
    networkSlug: routeParams.networkSlug,
    sortBy: selectedSort,
    autocomplete: search
  }
  const topics = getTopics(state, fetchTopicsParams)
  const hasMore = getHasMoreTopics(state, fetchTopicsParams)
  const totalTopics = getTotalTopics(state, fetchTopicsParams)
  const fetchIsPending = isPendingFor(FETCH_TOPICS, state)
  const currentUser = getMe(state, props)
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    routeParams,
    community,
    network,
    selectedSort,
    search,
    fetchTopicsParams,
    topics,
    hasMore,
    totalTopics,
    fetchIsPending,
    canModerate
  }
}

export const mapDispatchToProps = {
  toggleCommunityTopicSubscribe,
  setSort,
  setSearch,
  fetchTopics,
  deleteCommunityTopic
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    topics,
    hasMore,
    fetchIsPending,
    fetchTopicsParams
  } = stateProps
  const { fetchTopics } = dispatchProps

  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
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
