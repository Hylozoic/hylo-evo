import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { every, isEmpty } from 'lodash/fp'
import { groupUrl } from 'util/navigation'
import fetchForGroup from 'store/actions/fetchForGroup'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import { getSignupComplete } from 'store/selectors/getSignupState'
import useInvitation from 'store/actions/useInvitation'
import checkInvitation from 'store/actions/checkInvitation'
import Loading from 'components/Loading'
import setReturnToPath from 'store/actions/setReturnToPath'

export const SIGNUP_PATH = '/signup'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default function JoinGroup (props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const signupComplete = useSelector(getSignupComplete)

  useEffect(() => {
    (async function () {
      try {
        const invitationTokenAndCode = {
          invitationToken: getQuerystringParam('token', null, props),
          accessCode: getRouteParam('accessCode', null, props)
        }

        if (every(isEmpty, invitationTokenAndCode)) {
          throw new Error('Please provide either a `token` query string parameter or `accessCode` route param')
        }

        if (signupComplete) {
          const useInvitationResult = await dispatch(useInvitation(invitationTokenAndCode))
          const newMembership = useInvitationResult?.payload?.getData()?.membership
          const groupSlug = newMembership?.group?.slug

          if (groupSlug) {
            /*
              `AuthLayoutRouter` will already try and fetch this group due to the
              `/groups/:groupSlug/join/<token>` route matching `:groupSlug` before the
              group has been joined (unauthorized), this could be fixed and this extra
              fetch removed.
            */
            await dispatch(fetchForGroup(groupSlug))
            history.push(groupUrl(groupSlug))
          } else {
            throw new Error('Join group was unsuccessful')
          }
        } else {
          const checkInvitationResult = await dispatch(checkInvitation(invitationTokenAndCode))
          const isValidInvite = checkInvitationResult?.payload?.getData()?.valid

          if (isValidInvite) {
            dispatch(setReturnToPath(props.location.pathname + props.location.search))
            history.push(SIGNUP_PATH)
          } else {
            history.push(EXPIRED_INVITE_PATH)
          }
        }
      } catch (error) {
        history.goBack()
      }
    })()
  }, [])

  return <Loading />
}
