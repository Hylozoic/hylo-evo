import { mapStateToProps } from './Login.connector'
describe('Login', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps({}, { match: { uid: 'ksdjfkshfj' }, location: { search: '' } }).hasOwnProperty('error')).toBeTruthy()
    expect(mapStateToProps({}, { match: { uid: 'ksdjfkshfj' }, location: { search: '' } }).hasOwnProperty('downloadAppUrl')).toBeTruthy()
    expect(mapStateToProps({}, { match: { uid: 'ksdjfkshfj' }, location: { search: '' } }).hasOwnProperty('returnToURL')).toBeTruthy()
  })
})
