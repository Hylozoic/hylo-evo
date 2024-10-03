import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import debounced from 'util/debounced'
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
  setGroupTopicVisibility,
  setGroupTopicIsDefault
} from './TopicsSettingsTab.store'
import { createTopic } from 'components/CreateTopic/CreateTopic.store'

export function mapStateToProps (state, props) {
  // const routeParams = get('match.params', props)
  const group = props.group
  const selectedSort = getSort(state)
  const search = getSearch(state)
  const fetchTopicsParams = {
    group,
    groupSlug: group.slug,
    sortBy: selectedSort,
    autocomplete: search
  }
  const topics = getTopics(state, fetchTopicsParams)
  const hasMore = getHasMoreTopics(state, fetchTopicsParams)
  const totalTopics = getTotalTopics(state, fetchTopicsParams)
  const fetchIsPending = isPendingFor(FETCH_TOPICS, state)
  const defaultTopics = getDefaultTopics(state, fetchTopicsParams)

  return {
    group,
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
  setGroupTopicVisibility,
  setGroupTopicIsDefault,
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
