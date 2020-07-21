import { mapStateToProps, mergeProps } from './AllTopics.connector'
import { MODULE_NAME } from './AllTopics.store'

jest.mock('util/debounced', () => (fun, params) => fun(params))

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      [MODULE_NAME]: {},
      pending: {},
      queryResults: {}
    }
    const props = {
      navigation: {},
      match: {
        params: {
          slug: 'testslug'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('populates fetchTopics', () => {
    const stateProps = {
      topics: [1, 2, 3],
      selectedSort: 'num_followers',
      search: 're',
      hasMore: true,
      fetchTopicsParams: {
        communitySlug: 'testcommunityslug'
      }
    }
    const fetchTopics = jest.fn()
    const dispatchProps = { fetchTopics }
    const merged = mergeProps(stateProps, dispatchProps, {})

    expect(fetchTopics).not.toHaveBeenCalled()

    merged.fetchTopics()
    expect(fetchTopics).toHaveBeenCalledWith({
      ...stateProps.fetchTopicsParams,
      first: 20,
      offset: undefined
    })
    fetchTopics.mockClear()

    merged.fetchMoreTopics()
    expect(fetchTopics).toHaveBeenCalledWith({
      ...stateProps.fetchTopicsParams,
      first: 10,
      offset: stateProps.topics.length
    })
    fetchTopics.mockClear()

    const onePageMerged = mergeProps({ ...stateProps, hasMore: false }, dispatchProps, {})
    onePageMerged.fetchMoreTopics()
    expect(fetchTopics).not.toHaveBeenCalled()
  })
})
