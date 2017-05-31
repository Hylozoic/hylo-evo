import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import { omit } from 'lodash'
import { get, includes, isEmpty } from 'lodash/fp'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from 'store/actions/fetchCommunityTopics'
import { setSort } from './AllTopics.store'
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

const getHasMoreCommunityTopics = createSelector(getCommunityTopicResults, get('hasMore'))

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const selectedSort = state.AllTopics.sort

  const queryResultParams = {
    id: get('id', community),
    sortBy: selectedSort
  }
  const communityTopics = getCommunityTopics(state, queryResultParams)
  const hasMore = getHasMoreCommunityTopics(state, queryResultParams)

  return {
    community,
    communityTopics,
    slug: getParam('slug', state, props),
    totalTopics: 25,
    selectedSort,
    hasMore
  }
}

const mapDispatchToProps = {fetchCommunityTopics, toggleTopicSubscribe, setSort}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, communityTopics, selectedSort, hasMore } = stateProps
  const { setSort, toggleTopicSubscribe } = dispatchProps
  const fetchCommunityTopicsRaw = dispatchProps.fetchCommunityTopics

  const offset = get('length', communityTopics, 0)
  const first = 10

  const fetchCommunityTopics = () =>
    fetchCommunityTopicsRaw(community.id, {sortBy: selectedSort, first})

  const fetchMoreCommunityTopics = hasMore
    ? () => fetchCommunityTopicsRaw(community.id, {offset, sortBy: selectedSort, first})
    : () => {}

  return {
    ...omit(stateProps, 'community'),
    ...ownProps,
    setSort,
    fetchCommunityTopics,
    fetchMoreCommunityTopics,
    toggleSubscribe: (topicId, isSubscribing) =>
      toggleTopicSubscribe(topicId, community.id, isSubscribing)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
