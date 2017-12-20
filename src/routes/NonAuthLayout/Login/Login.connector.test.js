import { mapStateToProps } from './Login.connector'
describe('Login', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps({}, {})).hasOwnProperty('error')
    expect(mapStateToProps({}, {})).hasOwnProperty('downloadAppUrl')
    expect(mapStateToProps({}, {})).hasOwnProperty('returnToURL')
  })
})
