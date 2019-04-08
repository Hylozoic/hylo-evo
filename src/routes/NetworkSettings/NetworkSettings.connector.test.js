import { mapStateToProps, mapDispatchToProps } from './NetworkSettings.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      NetworkSettings: {

      },
      FullPageModal: {

      },
      pending: {}
    }
    const props = {}
    const stateProps = mapStateToProps(state, props)
    expect(stateProps).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    const dispatchProps = mapDispatchToProps(() => {})
    expect(dispatchProps).toMatchSnapshot()
  })
})
