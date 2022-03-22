import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { get, isNil } from 'lodash/fp'
import { groupUrl } from 'util/navigation'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import useInvitation from 'store/actions/useInvitation'
import checkInvitation from 'store/actions/checkInvitation'
import Loading from 'components/Loading'

export const SIGNUP_PATH = '/signup'
export const EXPIRED_INVITE_PATH = '/invite-expired'

// Should receive `token` and `email`query search params
export default function JoinGroup (props) {
  const dispatch = useDispatch()
  const signupState = useSelector(getSignupState)
  const signupComplete = signupState === SignupState.Complete
  const [newMembership, setNewMembership] = useState()
  const [isValidInvite, setIsValidInvite] = useState()
  const hasCheckedValidInvite = !isNil(isValidInvite)
  const groupSlug = get('group.slug', newMembership)
  const invitationTokenAndCode = {
    invitationToken: getQuerystringParam('token', null, props),
    accessCode: getRouteParam('accessCode', null, props)
  }
  // Currently doesn't seem to be sent by anything on the front-end or backend
  const redirectToView = getQuerystringParam('redirectToView', null, props)

  useEffect(() => {
    const asyncFunc = async () => {
      if (signupComplete) {
        const useInvitationResult = await dispatch(useInvitation(invitationTokenAndCode))
        const newMembership = useInvitationResult?.payload?.getData()?.membership
        if (newMembership) {
          setNewMembership(newMembership)
        }
      } else {
        const checkInvitationResult = await dispatch(checkInvitation(invitationTokenAndCode))
        const isValidInvite = checkInvitationResult?.payload?.getData()?.valid
        if (isValidInvite) {
          setIsValidInvite(isValidInvite)
        }
      }
    }

    asyncFunc()
  }, [signupComplete])

  if (!signupComplete && hasCheckedValidInvite) {
    if (isValidInvite) {
      return <Redirect to={SIGNUP_PATH} />
    } else {
      return <Redirect to={EXPIRED_INVITE_PATH} />
    }
  }

  if (signupComplete && groupSlug) {
    return <Redirect to={groupUrl(groupSlug, redirectToView || 'explore')} />
  }

  return <Loading />
}
