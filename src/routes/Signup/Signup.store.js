export const SIGNUP = `SIGNUP`

export function signup (fullName, email, password) {
  console.log('login', fullName, email, password)
  return {
    type: SIGNUP,
    payload: {
      api: {method: 'post', path: '/noo/signup', params: {fullName, email, password}}
    }
  }
}
