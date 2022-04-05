import { createSelector } from 'reselect'
import getMe from 'store/selectors/getMe'

/*

Hylo Authentication and Authorization state reflected in terms of "Signup State"

  *Authentication*: We know who you are (you've validated your email)
  *Authorization*: You are allowed to access things

The state object and selectors below are primarily utilized for high-level routing
in `RootRouter`, `SignupRouter`, and `AuthRouter`.

Each state below below implies transition from the previous state has completed, e.g.:

  None > EmailValidation > Registration > SignupInProgress > Complete

*Some of this may be best consolidated into the `me` resolver, and/or `User` and
`Session` models, on the API side.*

*/

// ONLY use in the `SignupRouter` and in `getAuthState` below
export const AuthState = {
  None: 'None',
  EmailValidation: 'EmailValidation',
  Registration: 'Registration',
  SignupInProgress: 'InProgress',
  Complete: 'Complete'
}

export const getAuthState = createSelector(
  getMe,
  currentUser => {
    if (!currentUser) return AuthState.None

    const { emailValidated, hasRegistered, settings } = currentUser
    const { signupInProgress } = settings

    if (!emailValidated) return AuthState.EmailValidation
    if (!hasRegistered) return AuthState.Registration
    if (signupInProgress) return AuthState.SignupInProgress

    return AuthState.Complete
  }
)

// Authenticated = Current User Exists
// * Should probably only be used for attaching Hylo user to external
// APIs (i.e. Mixpanel currently) as soon as authentication is complete
export const getAuthenticated = createSelector(
  getAuthState,
  authState => {
    return authState !== AuthState.None
  }
)

// Authenticated && (Signup In Progress || Signup Complete)
// * Used by `RootRouter`
export const getAuthorized = createSelector(
  getAuthState,
  authState => {
    return [
      AuthState.SignupInProgress,
      AuthState.Complete
    ].includes(authState)
  }
)

// Authenticated && Authorized && Signup In Progress
export const getSignupInProgress = createSelector(
  getAuthState,
  authState => {
    return authState === AuthState.SignupInProgress
  }
)

// Authenticated && Authorized && Signup Complete
export const getSignupComplete = createSelector(
  getAuthState,
  authState => {
    return authState === AuthState.Complete
  }
)

export default getAuthState
