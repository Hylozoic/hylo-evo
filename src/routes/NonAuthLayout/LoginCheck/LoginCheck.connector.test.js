import { mapStateToProps } from './LoginCheck.connector'

it('sets hasCheckedLogin correctly', () => {
  expect(mapStateToProps({Login: {isLoggedIn: true}}))
  .toEqual({hasCheckedLogin: true})

  expect(mapStateToProps({Login: {isLoggedIn: false}}))
  .toEqual({hasCheckedLogin: true})

  expect(mapStateToProps({Login: {isLoggedIn: null}}))
  .toEqual({hasCheckedLogin: false})
})
