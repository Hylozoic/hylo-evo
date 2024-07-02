import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Redirect } from 'react-router-dom'
import { every, isEmpty } from 'lodash/fp'
import { baseUrl, groupUrl } from 'util/navigation'
import setReturnToPath from 'store/actions/setReturnToPath'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import { getSignupComplete } from 'store/selectors/getAuthState'
import useInvitation from 'store/actions/useInvitation'
import checkInvitation from 'store/actions/checkInvitation'
import Loading from 'components/Loading'

export const SIGNUP_PATH = '/signup'

export default function JoinGroup (props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const signupComplete = useSelector(getSignupComplete)
  const [redirectTo, setRedirectTo] = useState()
  const { t } = useTranslation()

  // This is used in iFrames where we want people to join a group and go directly to a specific page (for OpenTEAM coffee shop for example)
  const redirectToView = getQuerystringParam('redirectToView', null, props)

  useEffect(() => {
    (async function () {
      try {
        const invitationTokenAndCode = {
          invitationToken: getQuerystringParam('token', null, props),
          accessCode: getRouteParam('accessCode', null, props)
        }
        if (every(isEmpty, invitationTokenAndCode)) {
          throw new Error(t('Please provide either a `token` query string parameter or `accessCode` route param'))
        }

        if (signupComplete) {
          const result = await dispatch(useInvitation(invitationTokenAndCode))
          const newMembership = result?.payload?.getData()?.membership
          const groupSlug = newMembership?.group?.slug

          if (groupSlug) {
            setRedirectTo(groupUrl(groupSlug, redirectToView || 'explore'))
          } else {
            throw new Error(t('Join group was unsuccessful'))
          }
        } else {
          const result = await dispatch(checkInvitation(invitationTokenAndCode))
          const isValidInvite = result?.payload?.getData()?.valid

          if (isValidInvite) {
            dispatch(setReturnToPath(props.location.pathname + props.location.search))
            setRedirectTo(SIGNUP_PATH)
          } else {
            setRedirectTo(`${SIGNUP_PATH}?error=invite-expired`)
          }
        }
      } catch (error) {
        window.alert(t('Sorry, your invitation to this group is expired, has already been used, or is invalid. Please contact a group Host for another one.'))
        history.push(baseUrl({}))
      }
    })()
  }, [])

  if (redirectTo) return <Redirect to={redirectTo} />

  return <Loading />
}
