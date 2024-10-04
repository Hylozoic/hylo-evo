import { useEffect } from 'react'
import { fetchGroups, getGroups, getHasMoreGroups } from 'store/actions/fetchGroups'
import { useSelector, useDispatch } from 'react-redux'
import isPendingFor from 'store/selectors/isPendingFor'
import { FETCH_GROUPS, SORT_NEAREST } from 'store/constants'

export default function useEnsureSearchedGroups ({ sortBy, search, offset, nearCoord, visibility, groupType, farmQuery }) {
  const useNearCoord = sortBy === SORT_NEAREST ? nearCoord : null
  const groups = useSelector(state => getGroups(state, { sortBy, search, nearCoord: useNearCoord, visibility, groupType, farmQuery }))
  const pending = useSelector(state => isPendingFor(FETCH_GROUPS, state))
  const hasMore = useSelector(state => getHasMoreGroups(state, { sortBy, search, nearCoord: useNearCoord, visibility, groupType, farmQuery }))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchGroups({ sortBy, search, offset: 0, nearCoord: useNearCoord, visibility, groupType, farmQuery }))
  }, [dispatch, search, sortBy, groupType, farmQuery])

  const fetchMoreGroups = (offset) => {
    if (pending || groups.length === 0 || !hasMore) return
    dispatch(fetchGroups({ sortBy, search, offset, nearCoord: useNearCoord, visibility, groupType, farmQuery }))
  }

  return { groups, pending, hasMore, fetchMoreGroups }
}
