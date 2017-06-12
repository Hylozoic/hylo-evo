import { mergeProps } from './Search.connector'

describe('mergeProps', () => {
  it('populates fetchSearchResults and fetchMoreSearchResults', () => {
    const stateProps = {
      searchResults: [1, 2, 3],
      filter: 'all',
      termForInput: 're',
      hasMore: true
    }

    const fetchSearchResultsDebounced = jest.fn()

    const dispatchProps = {
      fetchSearchResultsDebounced
    }

    const merged = mergeProps(stateProps, dispatchProps, {})

    expect(fetchSearchResultsDebounced).not.toHaveBeenCalled()
    merged.fetchSearchResults()
    expect(fetchSearchResultsDebounced).toHaveBeenCalledWith(
      {
        term: stateProps.termForInput,
        filter: stateProps.filter
      })
    fetchSearchResultsDebounced.mockClear()

    merged.fetchMoreSearchResults()
    expect(fetchSearchResultsDebounced).toHaveBeenCalledWith(
      {
        term: stateProps.termForInput,
        filter: stateProps.filter,
        offset: stateProps.searchResults.length
      })
    fetchSearchResultsDebounced.mockClear()

    const merged2 = mergeProps({...stateProps, hasMore: false}, dispatchProps, {})
    merged2.fetchMoreSearchResults()
    expect(fetchSearchResultsDebounced).not.toHaveBeenCalled()
  })
})
