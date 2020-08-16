import { mapStateToProps } from './Login.connector'
describe('Login', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps({}, { location: { search: '' } }).hasOwnProperty('error')).toBeTruthy()
    expect(mapStateToProps({}, { location: { search: '' } }).hasOwnProperty('downloadAppUrl')).toBeTruthy()
    expect(mapStateToProps({}, { location: { search: '' } }).hasOwnProperty('returnToURL')).toBeTruthy()
  })
})
