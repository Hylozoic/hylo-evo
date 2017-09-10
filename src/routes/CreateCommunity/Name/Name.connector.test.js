import { mapDispatchToProps } from './Name.connector'
describe('Domain', () => {
  it('should call fetchCommunity from mapDispatchToProps', () => {
    const dispatch = jest.fn(x => x)
    const props = {}
    const communityName = 'Community Name'
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.addCommunityName(communityName)).toMatchSnapshot()
  })
})
