import { mapDispatchToProps } from './Member.connector'

describe('mapDispatchToProps', () => {
  it('goToPerson is correct for "community" subject', () => {
    const dispatch = jest.fn(x => x)
    const props = {
      subject: 'community'
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.goToPerson(1, 'anything')()).toMatchSnapshot()
  })

  it('goToPerson is correct for "network" subject', () => {
    const dispatch = jest.fn(x => x)
    const props = {
      subject: 'network'
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.goToPerson(1, 'anything')()).toMatchSnapshot()
  })
})
