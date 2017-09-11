import { mapDispatchToProps, mapStateToProps } from './Privacy.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Privacy', () => {
  it('should call addCommunityPrivacy from mapDispatchToProps', () => {
    const privacy = 'privacy'
    expect(dispatchProps.addCommunityPrivacy(privacy)).toMatchSnapshot()
  })

  it('should call goToPreviousStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToPreviousStep()).toMatchSnapshot()
  })

  it('should call goToNextStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToNextStep()).toMatchSnapshot()
  })

  it('should call goHome from mapDispatchToProps', () => {
    expect(dispatchProps.goHome()).toMatchSnapshot()
  })

  it('should have communityPrivacy in mapStateToProps', () => {
    const privacy = 'privacy'

    const state = {
      CreateCommunity: {
        privacy
      }
    }
    expect(mapStateToProps(state, props).communityPrivacy).toBe(privacy)
  })
})
