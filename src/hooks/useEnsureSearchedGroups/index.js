import { useEffect } from 'react'
import { fetchGroups, getGroups, getHasMoreGroups } from 'store/actions/fetchGroups'
import { useSelector, useDispatch } from 'react-redux'
import isPendingFor from 'store/selectors/isPendingFor'
import { FETCH_GROUPS } from 'store/constants'

export default function useEnsureSearchedGroups ({ sortBy, search, offset }) {
  const groups = useSelector(state => getGroups(state, { sortBy, search }))
  const pending = useSelector(state => isPendingFor(FETCH_GROUPS, state))
  const hasMore = useSelector(state => getHasMoreGroups(state))
  const dispatch = useDispatch()

  useEffect(() => {
    console.log({ sortBy, search, offset })
    dispatch(fetchGroups({ sortBy, search, offset: 0 }))
  }, [dispatch, search, sortBy])

  const fetchMoreGroups = (offset) => {
    console.log('THIS IS BEING CALLED', { offset, pending, search, sortBy })
    if (pending || groups.length === 0 || !hasMore) return
    dispatch(fetchGroups({ sortBy, search, offset }))
  }

  return { groups, pending, hasMore, fetchMoreGroups }
}
