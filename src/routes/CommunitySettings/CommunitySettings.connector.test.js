import { mapStateToProps, mapDispatchToProps, mergeProps } from './CommunitySettings.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {

    }
    expect(mapStateToProps(state, {})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const state = {}
    const props = {}
    expect(mapDispatchToProps(state, props)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const stateProps = {}
    const dispatchProps = {}
    const ownProps = {}
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
  })
})
