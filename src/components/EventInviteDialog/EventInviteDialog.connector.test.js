import { mapStateToProps, mapDispatchToProps } from './EventInviteDialog.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const stateProps = mapStateToProps({}, { forCommunities: [] })
    expect(stateProps).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    expect(mapDispatchToProps()).toMatchSnapshot()
  })
})
