import { connect } from 'react-redux'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import { isEmpty, includes, get, debounce } from 'lodash/fp'
import {
  fetchSearchResults, getSearchTerm, FETCH_SEARCH, setSearchTerm
} from './Search.store'
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
      const type = content.constructor.modelName
      return {
        ...searchResult.ref,
        content,
        type
      }
    })
  }
)

const getHasMoreSearchResults = createSelector(getSearchResultResults, get('hasMore'))

export function mapStateToProps (state, props) {
  const term = getSearchTerm(state, props)

  const queryResultProps = {term}

  const searchResults = getSearchResults(state, queryResultProps)
  const hasMore = getHasMoreSearchResults(state, queryResultProps)
  return {
    searchResults,
    term,
    hasMore
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchSearchResultsDebounced: debounce(300, (search, offset) =>
      dispatch(fetchSearchResults(search, offset))),
    setSearchTerm: search => dispatch(setSearchTerm(search))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { term, searchResults, hasMore } = stateProps
  const { fetchSearchResultsDebounced } = dispatchProps

  const offset = get('length', searchResults)

  const fetchSearchResults = () => {
    console.log('mergeprops good')
    return fetchSearchResultsDebounced(term)
  }

  const fetchMoreSearchResults = () => hasMore
    ? fetchSearchResultsDebounced(term, offset)
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchSearchResults,
    fetchMoreSearchResults
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
