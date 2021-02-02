import { mapDispatchToProps } from './Member.connector'

describe('mapDispatchToProps', () => {
  it('goToPerson is correct for "groups" context', () => {
    const dispatch = jest.fn(x => x)
    const props = {
      context: 'groups'
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.goToPerson(1, 'anything')()).toMatchSnapshot()
  })
})
