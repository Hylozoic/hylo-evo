import { createSelector } from 'reselect'
import getSignupState, { SignupState } from './getSignupState'

export default createSelector(
  getSignupState,
  signupState => {
    // Maybe should be: [SignupState.InProgress, SignupState.Complete].includes(signupState)
    return signupState !== SignupState.None
  }
)
