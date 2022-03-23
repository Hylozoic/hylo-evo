import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { groupUrl } from 'util/navigation'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import useInvitation from 'store/actions/useInvitation'
import checkInvitation from 'store/actions/checkInvitation'
import Loading from 'components/Loading'
import setReturnToURL from 'store/actions/setReturnToURL'

export const SIGNUP_PATH = '/signup'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default function JoinGroup (props) {
  const dispatch = useDispatch()
  const signupState = useSelector(getSignupState)
  const [loading, setLoading] = useState(true)
  const [isValidInvite, setIsValidInvite] = useState()
  const [groupSlug, setGroupSlug] = useState()
  const signupComplete = signupState === SignupState.Complete
  const invitationTokenAndCode = {
    invitationToken: getQuerystringParam('token', null, props),
    accessCode: getRouteParam('accessCode', null, props)
  }

  useEffect(() => {
    (async function () {
      setLoading(true)
      try {
        if (signupComplete) {
          const useInvitationResult = await dispatch(useInvitation(invitationTokenAndCode))
          const newMembership = useInvitationResult?.payload?.getData()?.membership
          setGroupSlug(newMembership?.group?.slug)
        } else {
          const checkInvitationResult = await dispatch(checkInvitation(invitationTokenAndCode))
          const isValidInvite = checkInvitationResult?.payload?.getData()?.valid
          if (isValidInvite) {
            dispatch(setReturnToURL(props.location.pathname))
            setIsValidInvite(true)
          }
        }
      } catch (error) {
        console.log('!!!! error in JoinGroup', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (groupSlug) {
    return <Redirect to={groupUrl(groupSlug, 'explore')} />
  }

  if (isValidInvite) {
    return <Redirect to={SIGNUP_PATH} />
  } else {
    return <Redirect to={EXPIRED_INVITE_PATH} />
  }
}
