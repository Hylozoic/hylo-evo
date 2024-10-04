import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRouterParams from 'hooks/useRouterParams'
import fetchGroupDetails from 'store/actions/fetchGroupDetails'
import presentGroup from 'store/presenters/presentGroup'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import { createSelector } from 'reselect'
import isPendingFor from 'store/selectors/isPendingFor'
import { FETCH_GROUP_DETAILS } from 'store/constants'

const selectAndPresentGroup = createSelector(
  (state, slug) => getGroupForSlug(state, slug),
  (group) => presentGroup(group)
)

export default function useEnsureCurrentGroup () {
  const routerParams = useRouterParams()
  const groupSlug = routerParams.detailGroupSlug || routerParams.groupSlug

  const group = useSelector(state => selectAndPresentGroup(state, groupSlug))
  const pending = useSelector(state => isPendingFor(FETCH_GROUP_DETAILS, state))
  const dispatch = useDispatch()

  useEffect(() => {
    if (!pending && (!group || !group.id)) {
      dispatch(fetchGroupDetails({ slug: groupSlug, withWidgets: true }))
    }
  }, [dispatch, group, groupSlug, pending])

  return { group, pending }
}
