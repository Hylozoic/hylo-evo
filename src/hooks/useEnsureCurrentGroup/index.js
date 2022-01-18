import { useEffect } from 'react'
import fetchGroup from 'store/actions/fetchGroupDetails'
import { useSelector, useDispatch } from 'react-redux'
import presentGroup from 'store/presenters/presentGroup'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { useRouter } from 'hooks/useRouter'
import { createSelector } from 'reselect'
import isPendingFor from 'store/selectors/isPendingFor'
import { FETCH_GROUP_DETAILS } from 'store/constants'

const selectAndPresentGroup = createSelector(
  (state, router) => getGroupForCurrentRoute(state, router),
  (group) => presentGroup(group)
)

export function useEnsureCurrentGroup () {
  const router = useRouter()
  const groupSlug = router.query.groupSlug
  const group = useSelector(state => selectAndPresentGroup(state, router))
  const pending = useSelector(state => isPendingFor(FETCH_GROUP_DETAILS, state))
  const dispatch = useDispatch()
  useEffect(() => {
    if (!pending && (!group || !group.id)) {
      dispatch(fetchGroup(groupSlug))
    }
  }, [dispatch, groupSlug])

  return { group, pending }
}
