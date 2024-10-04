import getMe from 'store/selectors/getMe'
import { useSelector } from 'react-redux'

export function useCurrentUser () {
  return useSelector(getMe)
}
