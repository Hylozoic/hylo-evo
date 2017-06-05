import { mergeProps } from './AllTopics.connector'

describe('mergeProps', () => {
  it('populates fetchCommunityTopics and fetchMoreCommunityTopics', () => {
    const stateProps = {
      communityTopics: [1, 2, 3],
      selectedSort: 'num_followers',
      search: 're',
      community: {id: 99},
      hasMore: true
    }

    const fetchCommunityTopicsDebounced = jest.fn()

    const dispatchProps = {
      fetchCommunityTopicsDebounced
    }

    const merged = mergeProps(stateProps, dispatchProps, {})

    expect(fetchCommunityTopicsDebounced).not.toHaveBeenCalled()
    merged.fetchCommunityTopics()
    expect(fetchCommunityTopicsDebounced).toHaveBeenCalledWith(
      stateProps.community.id,
      {
        sortBy: stateProps.selectedSort,
        autocomplete: stateProps.search,
        first: 10
      })
    fetchCommunityTopicsDebounced.mockClear()

    merged.fetchMoreCommunityTopics()
    expect(fetchCommunityTopicsDebounced).toHaveBeenCalledWith(
      stateProps.community.id,
      {
        sortBy: stateProps.selectedSort,
        autocomplete: stateProps.search,
        first: 10,
        offset: stateProps.communityTopics.length
      })
    fetchCommunityTopicsDebounced.mockClear()

    const merged2 = mergeProps({...stateProps, hasMore: false}, dispatchProps, {})
    merged2.fetchMoreCommunityTopics()
    expect(fetchCommunityTopicsDebounced).not.toHaveBeenCalled()
  })
})
