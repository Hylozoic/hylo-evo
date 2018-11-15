import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get, debounce } from 'lodash/fp'
import {
  fetchSearchResults,
  getSearchTerm,
  FETCH_SEARCH,
  setSearchTerm,
  setSearchFilter,
  getSearchFilter,
  getSearchResults,
  getHasMoreSearchResults
} from './Search.store'
import { personUrl } from 'util/navigation'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getQueryParam from 'store/selectors/getQueryParam'

export function mapStateToProps (state, props) {
  const searchFromQuerystring = getQueryParam('t', state, props)
  const searchForInput = getSearchTerm(state, props)
  const filter = getSearchFilter(state, props)
  const queryResultProps = {search: searchForInput, type: filter}
  const searchResults = getSearchResults(state, queryResultProps)
  const hasMore = getHasMoreSearchResults(state, queryResultProps)
  return {
    pending: !!state.pending[FETCH_SEARCH],
    searchResults,
    searchForInput,
    searchFromQuerystring,
    filter,
    hasMore
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateQueryParam: debounce(500, search =>
      dispatch(changeQuerystringParam(props, 't', search, null, true))),
    setSearchTerm: search => dispatch(setSearchTerm(search)),
    setSearchFilter: filter => dispatch(setSearchFilter(filter)),
    fetchSearchResultsDebounced: debounce(500, opts => dispatch(fetchSearchResults(opts))),
    showPerson: personId => dispatch(push(personUrl(personId)))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { searchForInput, searchResults, hasMore, filter } = stateProps
  const { fetchSearchResultsDebounced } = dispatchProps

  const offset = get('length', searchResults)

  const fetchSearchResults = () => {
    return fetchSearchResultsDebounced({search: searchForInput, filter})
  }

  const fetchMoreSearchResults = () => hasMore
    ? fetchSearchResultsDebounced({search: searchForInput, filter, offset})
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
