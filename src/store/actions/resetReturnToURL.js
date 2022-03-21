import { RESET_RETURN_TO_URL } from 'store/constants'

export default function resetReturnToURL (returnToURL) {
  return {
    type: RESET_RETURN_TO_URL
  }
}
