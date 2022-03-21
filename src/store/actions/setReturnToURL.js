import { SET_RETURN_TO_URL } from 'store/constants'

export default function setReturnToURL (returnToURL) {
  return {
    type: SET_RETURN_TO_URL,
    payload: { returnToURL }
  }
}
