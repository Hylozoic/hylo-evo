import { mapDispatchToProps, mapStateToProps } from './Privacy.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Privacy', () => {
  it('should call addGroupPrivacy from mapDispatchToProps', () => {
    const privacy = 'privacy'
    expect(dispatchProps.addGroupPrivacy(privacy)).toMatchSnapshot()
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

  it('should have groupPrivacy in mapStateToProps', () => {
    const privacy = 'privacy'

    const state = {
      CreateGroup: {
        privacy
      }
    }
    expect(mapStateToProps(state, props).groupPrivacy).toBe(privacy)
  })
})
