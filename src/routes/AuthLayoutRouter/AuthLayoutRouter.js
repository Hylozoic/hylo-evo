import React, { useEffect, useMemo, useRef, useState } from 'react'
import { matchPath, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import isWebView from 'util/webView'
import { useLayoutFlags } from 'contexts/LayoutFlagsContext'
import getReturnToPath from 'store/selectors/getReturnToPath'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMyGroupMembership from 'store/selectors/getMyGroupMembership'
import { getSignupInProgress } from 'store/selectors/getAuthState'
import {
  POST_DETAIL_MATCH, GROUP_DETAIL_MATCH
} from 'util/navigation'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'

import './AuthLayoutRouter.scss'

export default function AuthLayoutRouter (props) {
  const resizeRef = useRef()

  const { hideNavLayout } = useLayoutFlags()
  const withoutNav = isWebView() || hideNavLayout

  const location = props.location
  const pathMatchParams = useMemo(() => (
    matchPath(location.pathname, [
      `/${POST_DETAIL_MATCH}`,
      '/groups/:joinGroupSlug/join/:accessCode',
      '/:context(groups)/:groupSlug/:view(events|groups|map|members|projects|proposals|settings|stream|topics|custom)?',
      '/:context(all|public)/:view(events|groups|map|members|projects|settings|stream|topics)?',
      '/:context(all|welcome|my)'
    ])?.params || { context: 'all' }
  ), [location.pathname])
  const hasDetail = !!matchPath(location.pathname, [
    `/(.*)/${POST_DETAIL_MATCH}`,
    `/(.*)/${GROUP_DETAIL_MATCH}`
  ])

  const paramPostId = matchPath(location.pathname, [
    `/:context(groups)/:groupSlug/${POST_DETAIL_MATCH}`,
    `/:context(groups)/:groupSlug/:view(events|groups|map|members|projects|settings|stream|proposals|topics|custom)/${POST_DETAIL_MATCH}`,
    `/:context(my)/:view(mentions|interactions|posts|announcements)/${POST_DETAIL_MATCH}`
  ])?.params?.postId
  const currentGroupSlug = pathMatchParams?.groupSlug
  const isMapView = pathMatchParams?.view === 'map'
  const isWelcomeContext = pathMatchParams?.context === 'welcome'
  // Store
  const dispatch = useDispatch()
  const currentGroup = useSelector(state => getGroupForCurrentRoute(state, { match: { params: pathMatchParams } }))
  const currentGroupMembership = useSelector(state => getMyGroupMembership(state, { match: { params: pathMatchParams } }))
  const returnToPath = useSelector(getReturnToPath)
  const signupInProgress = useSelector(getSignupInProgress)

  const [currentUserLoading, setCurrentUserLoading] = useState(true)
  const [currentGroupLoading, setCurrentGroupLoading] = useState()

  useEffect(() => {
    (async function () {
      await dispatch(fetchForCurrentUser())
      setCurrentUserLoading(false)
    })()
  }, [])

  useEffect(() => {
    (async function () {
      if (currentGroupSlug) {
        setCurrentGroupLoading(true)
        // await dispatch(fetchForGroup(currentGroupSlug))
        setCurrentGroupLoading(false)
      }
    })()
  }, [currentGroupSlug])

  // Scroll to top of center column when context, groupSlug, or view changes (from `pathMatchParams`)
  useEffect(() => {
    const centerColumn = document.getElementById(CENTER_COLUMN_ID)
    if (centerColumn) centerColumn.scrollTop = 0
  }, [pathMatchParams?.context, pathMatchParams?.groupSlug, pathMatchParams?.view])

  if (currentUserLoading) {
    return (
      <div styleName='container' data-testid='loading-screen'>
        <Loading type='loading-fullscreen' />
      </div>
    )
  }

  if (!signupInProgress && returnToPath) {
    return <Redirect push to={returnToPath} />
  }

  if (signupInProgress && !isWelcomeContext) {
    return <Redirect to='/welcome' />
  }

  if (!currentGroupMembership && hasDetail && paramPostId && currentGroupSlug) {
    /* There are times when users will be send to a path where they have access to the POST on that path but not to the GROUP on that path
      This redirect replaces the non-accessible groupSlug from the path with '/all', for a better UI experience
    */
    return <Redirect to='/welcome' />
  }

  if (currentGroupSlug && !currentGroup && !currentGroupLoading) {
    return <NotFound />
  }

  return (
    <div ref={resizeRef} styleName={cx('main', { 'map-view': isMapView, withoutNav, 'main-pad': !withoutNav })} />
  )
}
