import { mapStateToProps } from './AuthCheck.connector'

it('sets hasCheckedLogin correctly', () => {
  expect(mapStateToProps({login: {isLoggedIn: true}}))
  .toHaveProperty('hasCheckedLogin', true)

  expect(mapStateToProps({login: {isLoggedIn: false}}))
  .toHaveProperty('hasCheckedLogin', true)

  expect(mapStateToProps({login: {isLoggedIn: null}}))
  .toHaveProperty('hasCheckedLogin', false)
})
