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

    const fetchCommunityTopics = jest.fn()

    const dispatchProps = {
      fetchCommunityTopics
    }

    const merged = mergeProps(stateProps, dispatchProps, {})

    expect(fetchCommunityTopics).not.toHaveBeenCalled()
    merged.fetchCommunityTopics()
    expect(fetchCommunityTopics).toHaveBeenCalledWith(
      stateProps.community.id,
      {
        sortBy: stateProps.selectedSort,
        search: stateProps.search,
        first: 20
      })
    fetchCommunityTopics.mockClear()

    merged.fetchMoreCommunityTopics()
    expect(fetchCommunityTopics).toHaveBeenCalledWith(
      stateProps.community.id,
      {
        sortBy: stateProps.selectedSort,
        search: stateProps.search,
        first: 10,
        offset: stateProps.communityTopics.length
      })
    fetchCommunityTopics.mockClear()

    const merged2 = mergeProps({...stateProps, hasMore: false}, dispatchProps, {})
    merged2.fetchMoreCommunityTopics()
    expect(fetchCommunityTopics).not.toHaveBeenCalled()
  })
})
