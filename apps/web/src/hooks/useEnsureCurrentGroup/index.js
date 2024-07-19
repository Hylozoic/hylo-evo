import { useEffect } from 'react'
import fetchGroupDetails from 'store/actions/fetchGroupDetails'
import { useSelector, useDispatch } from 'react-redux'
import presentGroup from 'store/presenters/presentGroup'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import useRouter from 'hooks/useRouter'
import { createSelector } from 'reselect'
import isPendingFor from 'store/selectors/isPendingFor'
import { FETCH_GROUP_DETAILS } from 'store/constants'

const selectAndPresentGroup = createSelector(
  (state, router) => getGroupForCurrentRoute(state, router),
  (group) => presentGroup(group)
)

export default function useEnsureCurrentGroup () {
  const router = useRouter()
  const groupSlug = router.query.detailGroupSlug || router.query.groupSlug

  const group = useSelector(state => selectAndPresentGroup(state, router))
  const pending = useSelector(state => isPendingFor(FETCH_GROUP_DETAILS, state))
  const dispatch = useDispatch()

  useEffect(() => {
    if (!pending && (!group || !group.id)) {
      dispatch(fetchGroupDetails({ slug: groupSlug, withWidgets: true }))
    }
  }, [dispatch, groupSlug])

  return { group, pending }
}
