import { mapStateToProps } from './IntercomInit.connector'

describe('mapStateToProps', () => {
  it('returns expected keys', () => {
    expect(mapStateToProps({}, {})).toMatchSnapshot()
  })
})