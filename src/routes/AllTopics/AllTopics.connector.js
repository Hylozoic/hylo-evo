import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import debounced from 'util/debounced'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import isPendingFor from 'store/selectors/isPendingFor'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
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
  deleteGroupTopic
} from './AllTopics.store'

export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const group = getGroupForCurrentRoute(state, props)
  const selectedSort = getSort(state)
  const search = getSearch(state)
  const fetchTopicsParams = {
    groupSlug: routeParams.slug,
    sortBy: selectedSort,
    autocomplete: search
  }
  const topics = getTopics(state, fetchTopicsParams)
  const hasMore = getHasMoreTopics(state, fetchTopicsParams)
  const totalTopics = getTotalTopics(state, fetchTopicsParams)
  const fetchIsPending = isPendingFor(FETCH_TOPICS, state)
  const currentUser = getMe(state, props)
  const canModerate = currentUser && currentUser.canModerate(group)

  return {
    routeParams,
    group,
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
  toggleGroupTopicSubscribe,
  setSort,
  setSearch,
  fetchTopics,
  deleteGroupTopic
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
