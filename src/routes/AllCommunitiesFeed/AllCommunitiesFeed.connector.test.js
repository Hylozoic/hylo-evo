import { mapStateToProps } from './AllCommunitiesFeed.connector'

describe('mapStateToProps', () => {
  it('works', () => {
    const state = {pending: {}}

    const props = {
      location: {
        search: '?t=request'
      },
      match: {
        params: {
          postId: '7'
        }
      }
    }

    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})
