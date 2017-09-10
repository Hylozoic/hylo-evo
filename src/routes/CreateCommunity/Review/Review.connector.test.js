import { mapDispatchToProps } from './Review.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Domain', () => {
  it('should call updateUserSettings from mapDispatchToProps', () => {
    const changes = {
      name: 'name',
      email: 'email'
    }
    expect(dispatchProps.updateUserSettings(changes)).toMatchSnapshot()
  })

  it('should call removeNameFromCreateCommunity from mapDispatchToProps', () => {
    expect(dispatchProps.removeNameFromCreateCommunity()).toMatchSnapshot()
  })

  it('should call removeDomainFromCreateCommunity from mapDispatchToProps', () => {
    expect(dispatchProps.removeDomainFromCreateCommunity()).toMatchSnapshot()
  })
})
