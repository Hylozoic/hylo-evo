import { mapStateToProps } from './Login.connector'
describe('Login', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps({}, {}).hasOwnProperty('error')).toBeTruthy()
    expect(mapStateToProps({}, {}).hasOwnProperty('downloadAppUrl')).toBeTruthy()
    expect(mapStateToProps({}, {}).hasOwnProperty('returnToURL')).toBeTruthy()
  })
})
