import { createSelector } from 'reselect'
import getMe from 'store/selectors/getMe'

/*

Hylo Authentication and Authorization state reflected in terms of "Signup State"

  *Authentication*: We know who you are (you've validated your email)
  *Authorization*: You are allowed to access things

The state object and selectors below are primarily utilized for high-level routing
in `RootRouter`, `SignupRouter`, and `AuthRouter`.

Each state below below implies transition from the previous state has completed, e.g.:

  None > EmailValidation > Registration > InProgress > Complete

*Some of this may be best consolidated into the `me` resolver, and/or `User` and
`Session` models, on the API side.*

*/

// ONLY use in the `SignupRouter` and in `getSignupState` below
export const SignupState = {
  None: 'None',
  EmailValidation: 'EmailValidation',
  Registration: 'Registration',
  InProgress: 'InProgress',
  Complete: 'Complete'
}

export const getSignupState = createSelector(
  getMe,
  currentUser => {
    if (!currentUser) return SignupState.None

    const { emailValidated, hasRegistered, settings } = currentUser
    const { signupInProgress } = settings

    if (!emailValidated) return SignupState.EmailValidation
    if (!hasRegistered) return SignupState.Registration
    if (signupInProgress) return SignupState.InProgress

    return SignupState.Complete
  }
)

// Authenticated = Current User Exists
// * Should probably only be used for attaching Hylo user to external
// APIs (i.e. Mixpanel currently) as soon as authentication is complete
export const getAuthenticated = createSelector(
  getSignupState,
  signupState => {
    return signupState !== SignupState.None
  }
)

// Authenticated && (Signup In Progress || Signup Complete)
// * Used by `RootRouter`
export const getAuthorized = createSelector(
  getSignupState,
  signupState => {
    return [
      SignupState.InProgress,
      SignupState.Complete
    ].includes(signupState)
  }
)

// Authenticated && Authorized && Signup In Progress
export const getSignupInProgress = createSelector(
  getSignupState,
  signupState => {
    return signupState === SignupState.InProgress
  }
)

// Authenticated && Authorized && Signup Complete
export const getSignupComplete = createSelector(
  getSignupState,
  signupState => {
    return signupState === SignupState.Complete
  }
)

export default getSignupState
