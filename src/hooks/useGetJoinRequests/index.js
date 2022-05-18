import { useSelector } from 'react-redux'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import { createSelector } from 'reselect'
import { keyBy } from 'lodash'

export function useGetJoinRequests () {
  return useSelector(state => createSelector([getMyJoinRequests], (selection) => selection.filter(jr => jr.status === JOIN_REQUEST_STATUS.Pending)))
}

export function useKeyJoinRequestsByGroupId () {
  return useSelector(state => createSelector([useGetJoinRequests], (selection) => keyBy(selection, 'group.id')))
}
