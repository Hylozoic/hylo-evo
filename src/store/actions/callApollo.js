import { CALL_APOLLO } from 'store/constants'

export default function callApollo (apollo = {}) {
  return {
    type: CALL_APOLLO,
    apollo
  }
}
