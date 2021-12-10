import { useSelector } from 'react-redux'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'

export function useGetJoinRequests (group) {
  return useSelector(state => getMyJoinRequests(state).filter(jr => jr.status === JOIN_REQUEST_STATUS.Pending))
}
