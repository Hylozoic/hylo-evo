import { isEmpty } from 'lodash/fp'
import { SET_RETURN_TO_PATH } from 'store/constants'

export default function returnToPath (state = null, { type, payload }) {
  switch (type) {
    case SET_RETURN_TO_PATH: {
      return isEmpty(payload.returnToPath)
        ? null
        : payload.returnToPath
    }
  }

  return state
}
