import { createSelector } from 'reselect'

const getCurrentUser = createSelector(
  (state) => state.currentUser,
  (currentUser) => currentUser
)

export default getCurrentUser
