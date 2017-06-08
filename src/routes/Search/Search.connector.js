import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import { omit } from 'lodash'
import { get, includes, isEmpty, lowercase } from 'lodash/fp'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'
import { fetchSearch, FETCH_SEARCH } from './Search.store'
import { makeGetQueryResults } from 'store/reducers/queryResults'

const getSearchResultResults = makeGetQueryResults(FETCH_SEARCH)

export const getSearchResults = ormCreateSelector(
  orm,
  state => state.orm,
  getSearchResultResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.SearchResult.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
    .map(searchResult => {
      const content = searchResult.getContent(session)
      const modelName = content.constructor.modelName
      return {
        ...searchResult.ref,
        content,
        type: modelName
      }
    })
  }
)

export function mapStateToProps (state, props) {
  const searchResults = getSearchResults(state, props)
  return {
    searchResults
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchSearch: () => dispatch(fetchSearch('hylo', 0))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
