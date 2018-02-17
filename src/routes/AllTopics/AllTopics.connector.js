import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import getParam from 'store/selectors/getParam'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import { get, includes, isEmpty, debounce } from 'lodash/fp'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from 'store/actions/fetchCommunityTopics'
import { setSort, setSearch, getSort, getSearch } from './AllTopics.store'
import { makeGetQueryResults } from 'store/reducers/queryResults'

const getCommunityTopicResults = makeGetQueryResults(FETCH_COMMUNITY_TOPICS)

export const getCommunityTopics = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunityTopicResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.CommunityTopic.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

const getTotalCommunityTopics = createSelector(getCommunityTopicResults, get('total'))
const getHasMoreCommunityTopics = createSelector(getCommunityTopicResults, get('hasMore'))

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const selectedSort = getSort(state)
  const search = getSearch(state)
  const fetchIsPending = state.pending[FETCH_COMMUNITY_TOPICS]

  const queryResultParams = {
    id: get('id', community),
    sortBy: selectedSort,
    autocomplete: search
  }
  const communityTopics = getCommunityTopics(state, queryResultParams)
  const hasMore = getHasMoreCommunityTopics(state, queryResultParams)
  const total = getTotalCommunityTopics(state, queryResultParams)

  return {
    community,
    communityTopics,
    slug: getParam('slug', state, props),
    totalTopics: total,
    selectedSort,
    search,
    hasMore,
    fetchIsPending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      toggleTopicSubscribe,
      setSort,
      setSearch
    }, dispatch),
    fetchCommunityTopics: (communityId, { search, first, sortBy, offset } = {}) =>
      debouncedFetch(dispatch, communityId, {search, first, sortBy, offset})
  }
}

var debouncedFetch = debounce(250, (dispatch, communityId, { search, first, sortBy, offset }) => {
  return dispatch(fetchCommunityTopics(communityId, {
    autocomplete: search, first, sortBy, offset
  }))
})

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    community, communityTopics, selectedSort, search, hasMore, fetchIsPending
  } = stateProps
  const {
    setSort, setSearch, toggleTopicSubscribe
  } = dispatchProps

  const offset = get('length', communityTopics, 0)
  const first = 10
  const initialLoad = 20

  const fetchMoreCommunityTopics = fetchIsPending || !hasMore
    ? () => { }
    : () => dispatchProps.fetchCommunityTopics(community.id, {offset, sortBy: selectedSort, search, first})

  const fetchCommunityTopics = () =>
    dispatchProps.fetchCommunityTopics(community.id, { search, first: initialLoad, sortBy: selectedSort })

  return {
    ...stateProps,
    ...ownProps,
    setSort,
    setSearch,
    fetchCommunityTopics,
    fetchMoreCommunityTopics,
    toggleSubscribe: (topicId, isSubscribing) =>
      toggleTopicSubscribe(topicId, community.id, isSubscribing)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
