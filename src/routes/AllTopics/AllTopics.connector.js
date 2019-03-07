import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import debounced from 'util/debounced'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import isPendingFor from 'store/selectors/isPendingFor'
import toggleCommunityTopicSubscribe from 'store/actions/toggleCommunityTopicSubscribe'
import fetchTopicsForCurrentUser from 'store/actions/fetchTopicsForCurrentUser'
import { FETCH_TOPICS_FOR_CURRENT_USER } from 'store/constants'
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
  const queryResultParams = {
    communitySlug: routeParams.slug,
    networkSlug: routeParams.networkSlug,
    sortBy: selectedSort,
    autocomplete: search
  }
  const topics = getTopics(state, queryResultParams)
  const hasMore = getHasMoreTopics(state, queryResultParams)
  const totalTopics = getTotalTopics(state, queryResultParams)
  const fetchIsPending = isPendingFor(FETCH_TOPICS_FOR_CURRENT_USER, state)
  const currentUser = getMe(state, props)
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    routeParams,
    community,
    network,
    selectedSort,
    search,
    queryResultParams,
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
  fetchTopicsForCurrentUser,
  deleteCommunityTopic
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    topics,
    hasMore,
    fetchIsPending,
    queryResultParams
  } = stateProps
  const { fetchTopicsForCurrentUser } = dispatchProps

  const fetchTopics = () => debounced(
  fetchTopicsForCurrentUser, {
    ...queryResultParams,
    first: 20
  })
  const fetchMoreTopics = () => {
    !fetchIsPending && hasMore && debounced(
      fetchTopicsForCurrentUser, {
        ...queryResultParams,
        offset: get('length', topics, 0),
        first: 10
      }
    )
  }

  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    fetchTopics,
    fetchMoreTopics
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
