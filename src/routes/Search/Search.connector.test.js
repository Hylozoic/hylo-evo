import { presentSearchResult, mergeProps } from './Search.connector'
import orm from 'store/models'



describe('presentSearchResult', () => {
  const session = orm.session(orm.getEmptyState())
  const commentId = 21
  const creator = session.Person.create({
    name: 'Ron'
  })
  session.Comment.create({
    id: commentId,
    creator: creator.id
  })
  session.Attachment.create({
    url: 'foo.png',
    comment: commentId
  })
  const searchResult = session.SearchResult.create({
    content: `Comment-${commentId}`
  })

  it('presents a Comment SearchResult', () => {
    expect(presentSearchResult(searchResult, session))
    .toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('populates fetchSearchResults and fetchMoreSearchResults', () => {
    const stateProps = {
      searchResults: [1, 2, 3],
      filter: 'all',
      searchForInput: 're',
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
        search: stateProps.searchForInput,
        filter: stateProps.filter
      })
    fetchSearchResultsDebounced.mockClear()

    merged.fetchMoreSearchResults()
    expect(fetchSearchResultsDebounced).toHaveBeenCalledWith(
      {
        search: stateProps.searchForInput,
        filter: stateProps.filter,
        offset: stateProps.searchResults.length
      })
    fetchSearchResultsDebounced.mockClear()

    const merged2 = mergeProps({...stateProps, hasMore: false}, dispatchProps, {})
    merged2.fetchMoreSearchResults()
    expect(fetchSearchResultsDebounced).not.toHaveBeenCalled()
  })
})
