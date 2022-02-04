import { useState, useEffect } from 'react'
import { fetchGroups, getGroups } from 'store/actions/fetchGroups'
import { useSelector, useDispatch } from 'react-redux'
import isPendingFor from 'store/selectors/isPendingFor'
import { FETCH_GROUPS } from 'store/constants'
const pageSize = 20

export default function useEnsureSearchedGroups ({ sortBy, search, page = 0 }) {
  const [internalPage, setInternalPage] = useState(0)
  const groups = useSelector(state => getGroups(state, { sortBy, search, offset: internalPage }))
  const pending = useSelector(state => isPendingFor(FETCH_GROUPS, state))
  const dispatch = useDispatch()


  useEffect(() => {
    setInternalPage(0)
  }, [search, sortBy])

  useEffect(() => {
    if (!pending && (internalPage < page || internalPage === 0)) {
      dispatch(fetchGroups({ sortBy, search, offset: internalPage === 0 ? 0 : (internalPage + 1) * pageSize }))
      setInternalPage(internalPage + 1)
    }
  }, [dispatch, search, sortBy, page])

  return { groups, pending }
}
