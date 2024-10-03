import { SET_RETURN_TO_PATH } from 'store/constants'

export default function setReturnToPath (returnToPath) {
  return {
    type: SET_RETURN_TO_PATH,
    payload: {
      returnToPath
    }
  }
}
