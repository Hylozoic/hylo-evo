import { createSelector } from 'reselect'
import getMe from 'store/selectors/getMe'

// Turn into selector or custom hook
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

export default getSignupState
