import { useEffect } from 'react'
import { fetchGroups, getGroups, getHasMoreGroups } from 'store/actions/fetchGroups'
import { useSelector, useDispatch } from 'react-redux'
import isPendingFor from 'store/selectors/isPendingFor'
import { FETCH_GROUPS, SORT_NEAREST } from 'store/constants'

export default function useEnsureSearchedGroups ({ sortBy, search, offset, nearCoord, visibility, groupType }) {
  const useNearCoord = sortBy === SORT_NEAREST ? nearCoord : null
  const groups = useSelector(state => getGroups(state, { sortBy, search, nearCoord: useNearCoord, visibility, groupType }))
  const pending = useSelector(state => isPendingFor(FETCH_GROUPS, state))
  const hasMore = useSelector(state => getHasMoreGroups(state, { sortBy, search, nearCoord: useNearCoord, visibility, groupType }))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchGroups({ sortBy, search, offset: 0, nearCoord: useNearCoord, visibility, groupType }))
  }, [dispatch, search, sortBy, groupType])

  const fetchMoreGroups = (offset) => {
    if (pending || groups.length === 0 || !hasMore) return
    dispatch(fetchGroups({ sortBy, search, offset, nearCoord: useNearCoord, visibility, groupType }))
  }

  return { groups, pending, hasMore, fetchMoreGroups }
}
