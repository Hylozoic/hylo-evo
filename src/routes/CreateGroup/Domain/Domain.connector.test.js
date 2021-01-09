import { mapDispatchToProps, mapStateToProps } from './Domain.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Domain', () => {
  it('should call fetchGroupExists from mapDispatchToProps', () => {
    const slug = 'slug'
    expect(dispatchProps.fetchGroupExists(slug)).toMatchSnapshot()
  })
  it('should call addGroupDomain from mapDispatchToProps', () => {
    const groupDomain = 'domain'
    expect(dispatchProps.addGroupDomain(groupDomain)).toMatchSnapshot()
  })
  it('should call goToNextStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToNextStep()).toMatchSnapshot()
  })
  it('should call goToPreviousStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToPreviousStep()).toMatchSnapshot()
  })
  it('should call goHome from mapDispatchToProps', () => {
    expect(dispatchProps.goHome()).toMatchSnapshot()
  })
  it('should have groupName in mapStateToProps', () => {
    const domain = 'domain'
    const state = {
      CreateGroup: {
        domain
      }
    }
    expect(mapStateToProps(state, props).groupDomain).toBe(domain)
  })
})
