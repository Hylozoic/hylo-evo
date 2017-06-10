import { connect } from 'react-redux'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import { isEmpty, includes, get, debounce } from 'lodash/fp'
import {
  fetchSearchResults,
  getSearchTerm,
  FETCH_SEARCH,
  setSearchTerm,
  setSearchFilter,
  getSearchFilter
} from './Search.store'
import changeQueryParam from 'store/actions/changeQueryParam'
import getQueryParam from 'store/selectors/getQueryParam'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { push } from 'react-router-redux'
import { postUrl, personUrl } from 'util/index'

const getSearchResultResults = makeGetQueryResults(FETCH_SEARCH)

function presentSearchResult (searchResult, session) {
  const contentRaw = searchResult.getContent(session)
  const type = contentRaw.constructor.modelName

  var content = contentRaw

  if (type === 'Post') {
    content = {
      ...content.ref,
      creator: content.creator,
      commenters: content.commenters.toModelArray(),
      communities: content.communities.toModelArray()
    }
  }

  return {
    ...searchResult.ref,
    content,
    type
  }
}

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
    .map(searchResults => presentSearchResult(searchResults, session))
  }
)

const getHasMoreSearchResults = createSelector(getSearchResultResults, get('hasMore'))

export function mapStateToProps (state, props) {
  const termFromQueryString = getQueryParam('t', state, props)
  const termForInput = getSearchTerm(state, props)
  const filter = getSearchFilter(state, props)

  const queryResultProps = {term: termForInput, type: filter}

  const searchResults = getSearchResults(state, queryResultProps)
  const hasMore = getHasMoreSearchResults(state, queryResultProps)
  return {
    pending: !!state.pending[FETCH_SEARCH],
    searchResults,
    termForInput,
    termFromQueryString,
    filter,
    hasMore
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateQueryParam: debounce(500, term =>
      dispatch(changeQueryParam(props, 't', term))),
    setSearchTerm: term => dispatch(setSearchTerm(term)),
    setSearchFilter: filter => dispatch(setSearchFilter(filter)),
    fetchSearchResultsDebounced: debounce(500, opts =>
      dispatch(fetchSearchResults(opts))),
    showPostDetails: postId =>
      dispatch(push(postUrl(postId))),
    showPerson: personId =>
      dispatch(push(personUrl(personId)))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { termForInput, searchResults, hasMore, filter } = stateProps
  const { fetchSearchResultsDebounced } = dispatchProps

  const offset = get('length', searchResults)

  const fetchSearchResults = () => {
    return fetchSearchResultsDebounced({term: termForInput, filter})
  }

  const fetchMoreSearchResults = () => hasMore
    ? fetchSearchResultsDebounced({term: termForInput, filter, offset})
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
