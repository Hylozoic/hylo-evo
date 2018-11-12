import { connect } from 'react-redux'
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
import changeQueryParam from 'store/actions/changeQueryParam'
import getQueryParam from 'store/selectors/getQueryParam'
import { push } from 'react-router-redux'
import voteOnPost from 'store/actions/voteOnPost'
import { postUrl, personUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  const searchFromQueryString = getQueryParam('t', state, props)
  const searchForInput = getSearchTerm(state, props)
  const filter = getSearchFilter(state, props)

  const queryResultProps = {search: searchForInput, type: filter}

  const searchResults = getSearchResults(state, queryResultProps)
  const hasMore = getHasMoreSearchResults(state, queryResultProps)
  return {
    pending: !!state.pending[FETCH_SEARCH],
    searchResults,
    searchForInput,
    searchFromQueryString,
    filter,
    hasMore
  }
}

export function mapDispatchToProps (dispatch, props) {
  const matchParams = get('match.params', props)
  return {
    updateQueryParam: debounce(500, search =>
      dispatch(changeQueryParam(props, 't', search, null, true))),
    setSearchTerm: search => dispatch(setSearchTerm(search)),
    setSearchFilter: filter => dispatch(setSearchFilter(filter)),
    fetchSearchResultsDebounced: debounce(500, opts => dispatch(fetchSearchResults(opts))),
    showPostDetails: postId => dispatch(push(postUrl(postId, matchParams))),
    showPerson: personId => dispatch(push(personUrl(personId))),
    voteOnPost: (postId, myVote) => dispatch(voteOnPost(postId, myVote))
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
