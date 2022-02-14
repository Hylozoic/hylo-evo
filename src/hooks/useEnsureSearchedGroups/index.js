import { useEffect } from 'react'
import { fetchGroups, getGroups, getHasMoreGroups } from 'store/actions/fetchGroups'
import { useSelector, useDispatch } from 'react-redux'
import isPendingFor from 'store/selectors/isPendingFor'
import { FETCH_GROUPS, SORT_NEAREST } from 'store/constants'

export default function useEnsureSearchedGroups ({ sortBy, search, offset, coord, visibility }) {
  const groups = useSelector(state => getGroups(state, { sortBy, search, coord: sortBy === SORT_NEAREST ? coord : null, visibility }))
  const pending = useSelector(state => isPendingFor(FETCH_GROUPS, state))
  const hasMore = useSelector(state => getHasMoreGroups(state, { sortBy, search, coord: sortBy === SORT_NEAREST ? coord : null, visibility }))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchGroups({ sortBy, search, offset: 0, coord: sortBy === SORT_NEAREST ? coord : null, visibility }))
  }, [dispatch, search, sortBy])

  const fetchMoreGroups = (offset) => {
    console.log('THIS IS BEING CALLED', { offset, pending, search, sortBy })
    if (pending || groups.length === 0 || !hasMore) return
    dispatch(fetchGroups({ sortBy, search, offset, coord: sortBy === SORT_NEAREST ? coord : null, visibility }))
  }

  return { groups, pending, hasMore, fetchMoreGroups }
}
