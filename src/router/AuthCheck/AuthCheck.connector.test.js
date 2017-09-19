import { mapStateToProps } from './AuthCheck.connector'

it('sets hasCheckedLogin correctly', () => {
  expect(mapStateToProps({login: {isLoggedIn: true}}))
  .toEqual({hasCheckedLogin: true})

  expect(mapStateToProps({login: {isLoggedIn: false}}))
  .toEqual({hasCheckedLogin: true})

  expect(mapStateToProps({login: {isLoggedIn: null}}))
  .toEqual({hasCheckedLogin: false})
})
