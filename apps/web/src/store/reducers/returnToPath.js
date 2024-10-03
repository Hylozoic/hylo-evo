import { isEmpty } from 'lodash/fp'
import { LOGOUT, SET_RETURN_TO_PATH } from 'store/constants'

// The initial state is set from localStorage such that on reload
// the stored `returnToPath` will be retrieved. It is reset along with
// the redux store value. It is debatable whether we still need or
// want to do any of this through redux as it's pretty much just doing
// localstate stuff. Keeping both for now to honor existing use of
// selectors and actions.
export const initialState = (typeof window !== 'undefined')
  ? JSON.parse(window.localStorage.getItem('returnToPath'))
  : {}

export default function returnToPath (state = initialState, { type, payload }) {
  switch (type) {
    case SET_RETURN_TO_PATH: {
      const returnToPath = isEmpty(payload.returnToPath)
        ? null
        : payload.returnToPath

      setReturnToPathLocalState(returnToPath)

      return returnToPath
    }
    // Handles the case the of logout action firing and then NonAuthLayout capturing
    // the current auth'd URL as the `returnToPath`. There may be a better way to handle
    // this, but this works for now.
    case LOGOUT: {
      setReturnToPathLocalState(null)
      return null
    }
  }

  return state
}

export const setReturnToPathLocalState = returnToPath => {
  // Needed for production build
  if ((typeof window !== 'undefined')) {
    window.localStorage.setItem('returnToPath', JSON.stringify(returnToPath))
  }
}
