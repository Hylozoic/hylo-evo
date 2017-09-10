import { mapDispatchToProps, mapStateToProps } from './Name.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Domain', () => {
  it('should call fetchCommunity from mapDispatchToProps', () => {
    const communityName = 'Community Name'
    expect(dispatchProps.addCommunityName(communityName)).toMatchSnapshot()
  })

  it('should call goToNextStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToNextStep()).toMatchSnapshot()
  })

  it('should call goHome from mapDispatchToProps', () => {
    expect(dispatchProps.goHome()).toMatchSnapshot()
  })

  it('should have communityName in mapStateToProps', () => {
    const communityName = 'communityName'
    const state = {
      CreateCommunity: {
        name: communityName
      }
    }
    expect(mapStateToProps(state, props).communityName).toBe(communityName)
  })
})
