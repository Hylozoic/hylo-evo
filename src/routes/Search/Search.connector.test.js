import { mergeProps } from './Search.connector'

describe.skip('mergeProps', () => {
  it('populates fetchCommunityTopics and fetchMoreCommunityTopics', () => {
    const stateProps = {
      communityTopics: [1, 2, 3],
      selectedSort: 'num_followers',
      search: 're',
      community: {id: 99},
      hasMore: true
    }

    const fetchCommunityTopicsRaw = jest.fn()

    const dispatchProps = {
      fetchCommunityTopicsRaw
    }

    const merged = mergeProps(stateProps, dispatchProps, {})

    expect(fetchCommunityTopicsRaw).not.toHaveBeenCalled()
    merged.fetchCommunityTopics()
    expect(fetchCommunityTopicsRaw).toHaveBeenCalledWith(
      stateProps.community.id,
      {
        sortBy: stateProps.selectedSort,
        autocomplete: stateProps.search,
        first: 10
      })
    fetchCommunityTopicsRaw.mockClear()

    merged.fetchMoreCommunityTopics()
    expect(fetchCommunityTopicsRaw).toHaveBeenCalledWith(
      stateProps.community.id,
      {
        sortBy: stateProps.selectedSort,
        autocomplete: stateProps.search,
        first: 10,
        offset: stateProps.communityTopics.length
      })
    fetchCommunityTopicsRaw.mockClear()

    const merged2 = mergeProps({...stateProps, hasMore: false}, dispatchProps, {})
    merged2.fetchMoreCommunityTopics()
    expect(fetchCommunityTopicsRaw).not.toHaveBeenCalled()
  })
})
