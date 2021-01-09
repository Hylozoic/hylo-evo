import { mapDispatchToProps } from './Member.connector'

describe('mapDispatchToProps', () => {
  it('goToPerson is correct for "group" subject', () => {
    const dispatch = jest.fn(x => x)
    const props = {
      subject: 'group'
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.goToPerson(1, 'anything')()).toMatchSnapshot()
  })
})
