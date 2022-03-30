import { isEmpty } from 'lodash/fp'
import { SET_RETURN_TO_PATH } from 'store/constants'

// The initial state is set from localStorage such that on reload
// the stored `returnToPath` will be retrieved. It is reset along with
// the redux store value. It is debatable whether we still need or
// want to do any of this through redux as it's pretty much just doing
// localstate stuff. Keeping both for now to honor existing use of
// selectors and actions.
export const initialState = JSON.parse(window.localStorage.getItem('returnToPath'))

export default function returnToPath (state = initialState, { type, payload }) {
  switch (type) {
    case SET_RETURN_TO_PATH: {
      const returnToPath = isEmpty(payload.returnToPath)
        ? null
        : payload.returnToPath

      window.localStorage.setItem('returnToPath', JSON.stringify(returnToPath))

      return returnToPath
    }
  }

  return state
}
