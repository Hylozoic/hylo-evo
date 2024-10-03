import { mapDispatchToProps } from './PostCard.connector'

describe('mapDispatchToProps', () => {
  it('', () => {
    const props = {
      post: {
        id: 1
      }
    }
    const dispatchProps = mapDispatchToProps({}, props)
    expect(dispatchProps).toMatchSnapshot()
  })
})
