import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { get, isNil } from 'lodash/fp'
import { groupUrl } from 'util/navigation'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import {
  getNewMembership, getValidInvite, useInvitation, checkInvitation
} from './JoinGroup.store'
import Loading from 'components/Loading'

export const SIGNUP_PATH = '/signup'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default function JoinGroup (props) {
  const dispatch = useDispatch()
  const newMembership = useSelector(getNewMembership)
  const currentUser = useSelector(getMe)
  const isLoggedIn = useSelector(getIsLoggedIn)
  const isValidInvite = useSelector(getValidInvite)
  const groupSlug = get('group.slug', newMembership)
  const hasCheckedValidInvite = !isNil(isValidInvite)
  const invitationToken = getQuerystringParam('token', null, props)
  const accessCode = getRouteParam('accessCode', null, props)
  // Currently doesn't seem to be sent by anything on the front-end or backend
  const redirectToView = getQuerystringParam('redirectToView', null, props)

  useEffect(() => {
    if (!isLoggedIn) {
      checkInvitation({ invitationToken, accessCode })
    } else {
      fetchForCurrentUser()
      if (currentUser) dispatch(useInvitation({ invitationToken, accessCode }))
    }
  }, [isLoggedIn, currentUser])

  useEffect(() => {
    if (currentUser) {
      dispatch(useInvitation())
    }
  }, [dispatch, useInvitation, currentUser])

  if (!isLoggedIn && hasCheckedValidInvite) {
    if (isValidInvite) {
      return <Redirect to={SIGNUP_PATH} />
    } else {
      return <Redirect to={EXPIRED_INVITE_PATH} />
    }
  }

  if (isLoggedIn && groupSlug) {
    return <Redirect to={groupUrl(groupSlug, redirectToView || 'explore')} />
  }

  return <Loading />
}
