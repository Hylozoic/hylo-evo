export const MODULE_NAME = 'PasswordReset'
export const RESET_PASSWORD = `${MODULE_NAME}/RESET_PASSWORD`

export function resetPassword (email) {
  return {
    type: RESET_PASSWORD,
    payload: {
      api: { method: 'post', path: '/noo/user/password', params: { email, evo: true } }
    }
  }
}
