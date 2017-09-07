import { mapDispatchToProps } from './Review.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)
// const stateProps = mapStateToProps(state, props)

describe('Review', () => {
  it('should call updateUserSettings', () => {
    const name = 'My Name'
    expect(dispatchProps.updateUserSettings(name)).toMatchSnapshot()
  })

  it('should call fetchMySkills', () => {
    expect(dispatchProps.fetchMySkills()).toMatchSnapshot()
  })
})
