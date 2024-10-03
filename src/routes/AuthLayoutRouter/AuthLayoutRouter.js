import React, { useEffect, useMemo, useRef, useState } from 'react'
import { matchPath, Route, Routes, Navigate, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { IntercomProvider } from 'react-use-intercom'
import { Helmet } from 'react-helmet'
import Div100vh from 'react-div-100vh'
import { get, some } from 'lodash/fp'
import { useResizeDetector } from 'react-resize-detector'
import cx from 'classnames'
import mixpanel from 'mixpanel-browser'
import config, { isTest } from 'config/index'
import isWebView from 'util/webView'
import { localeLocalStorageSync } from 'util/locale'
import { useLayoutFlags } from 'contexts/LayoutFlagsContext'
import getReturnToPath from 'store/selectors/getReturnToPath'
import setReturnToPath from 'store/actions/setReturnToPath'
import fetchCommonRoles from 'store/actions/fetchCommonRoles'
import fetchPlatformAgreements from 'store/actions/fetchPlatformAgreements'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import fetchForGroup from 'store/actions/fetchForGroup'
import getMe from 'store/selectors/getMe'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getMyGroupMembership from 'store/selectors/getMyGroupMembership'
import { getSignupInProgress } from 'store/selectors/getAuthState'
import { toggleDrawer as toggleDrawerAction } from './AuthLayoutRouter.store'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'
import {
  OPTIONAL_POST_MATCH, OPTIONAL_GROUP_MATCH, OPTIONAL_NEW_POST_MATCH,
  POST_DETAIL_MATCH, GROUP_DETAIL_MATCH, REQUIRED_EDIT_POST_MATCH, postUrl
} from 'util/navigation'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'
import AllTopics from 'routes/AllTopics'
import ChatRoom from 'routes/ChatRoom'
import CreateModal from 'components/CreateModal'
import GroupDetail from 'routes/GroupDetail'
import GroupSettings from 'routes/GroupSettings'
import GroupSidebar from 'routes/GroupSidebar'
import GroupWelcomeModal from 'routes/GroupWelcomeModal'
import Groups from 'routes/Groups'
import GroupExplorer from 'routes/GroupExplorer'
import Drawer from './components/Drawer'
import Events from 'routes/Events'
import Stream from 'routes/Stream'
import MapExplorer from 'routes/MapExplorer'
import JoinGroup from 'routes/JoinGroup'
import LandingPage from 'routes/LandingPage'
import Loading from 'components/Loading'
import MemberProfile from 'routes/MemberProfile'
import Members from 'routes/Members'
import Messages from 'routes/Messages'
import Navigation from './components/Navigation'
import NotFound from 'components/NotFound'
import PostDetail from 'routes/PostDetail'
import Search from 'routes/Search'
import WelcomeWizardRouter from 'routes/WelcomeWizardRouter'
import SiteTour from 'routes/AuthLayoutRouter/components/SiteTour'
import SocketListener from 'components/SocketListener'
import SocketSubscriber from 'components/SocketSubscriber'
import TopNav from './components/TopNav'

import UserSettings from 'routes/UserSettings'
import { GROUP_TYPES } from 'store/models/Group'
import classes from './AuthLayoutRouter.module.scss'

export default function AuthLayoutRouter (props) {
  const resizeRef = useRef()
  const { width } = useResizeDetector({ handleHeight: false, targetRef: resizeRef })

  const { hideNavLayout } = useLayoutFlags()
  const withoutNav = isWebView() || hideNavLayout

  const params = useParams()

  // Setup `pathMatchParams` and `queryParams` (`matchPath` best only used in this section)
  const location = useLocation()
  const pathMatchParams = useMemo(() => {
    const matches = [
      { path: `${POST_DETAIL_MATCH}` },
      { path: 'groups/:joinGroupSlug/join/:accessCode' },
      { path: 'groups/:groupSlug/:view/*' },
      { path: 'groups/:groupSlug/*' },
      { path: 'all' },
      { path: 'public' },
      { path: 'welcome' },
      { path: 'my/*' },
      { path: 'all/:view/*' },
      { path: 'public/:view/*' }
    ]
    const match = matches.find(match => matchPath(match, location.pathname))
    const matchResult = match ? matchPath(match, location.pathname) : null
    return matchResult?.params || { context: 'all' }
  }, [location.pathname])

  const hasDetail = useMemo(() => {
    const detailRegex = /\/(group|post)\/([a-zA-Z0-9-]+)/
    return detailRegex.test(location.pathname)
  }, [location.pathname])

  const paramPostId = useMemo(() => {
    const match = location.pathname.match(/\/post\/(\d+)/)
    return match ? match[1] : null
  }, [location.pathname])

  const currentGroupSlug = pathMatchParams?.groupSlug
  const isMapView = pathMatchParams?.view === 'map'
  const hideSidebar = isMapView || pathMatchParams?.view === 'topics'
  const isWelcomeContext = pathMatchParams?.context === 'welcome'
  const queryParams = Object.fromEntries(new URLSearchParams(location.search))
  const hideDrawer = queryParams?.hideDrawer !== 'true'

  // Store
  const dispatch = useDispatch()
  const currentGroup = useSelector(state => getGroupForSlug(state, currentGroupSlug))
  const currentGroupMembership = useSelector(state => getMyGroupMembership(state, currentGroupSlug))
  const currentUser = useSelector(getMe)
  const isDrawerOpen = useSelector(state => get('AuthLayoutRouter.isDrawerOpen', state))
  const isGroupMenuOpen = useSelector(state => get('AuthLayoutRouter.isGroupMenuOpen', state))
  const lastViewedGroup = useSelector(getLastViewedGroup)
  const memberships = useSelector(getMyMemberships)
  const returnToPath = useSelector(getReturnToPath)
  const signupInProgress = useSelector(getSignupInProgress)

  const [currentUserLoading, setCurrentUserLoading] = useState(true)
  const [currentGroupLoading, setCurrentGroupLoading] = useState()

  useEffect(() => {
    (async function () {
      await dispatch(fetchCommonRoles())
      await dispatch(fetchForCurrentUser())
      setCurrentUserLoading(false)
      await dispatch(fetchPlatformAgreements())
    })()
  }, [])

  useEffect(() => {
    if (currentUser?.id) {
      mixpanel.identify(currentUser.id)
      mixpanel.people.set({
        $name: currentUser.name,
        $email: currentUser.email,
        $location: currentUser.location
      })

      if (currentUser?.settings?.locale) localeLocalStorageSync(currentUser?.settings?.locale)
    }
  }, [currentUser?.email, currentUser?.id, currentUser?.location, currentUser?.name, currentUser?.settings?.locale])

  useEffect(() => {
    // Add all current group membershps to mixpanel user
    mixpanel.set_group('groupId', memberships.map(m => m.group.id))

    if (currentGroup?.id) {
      // Setup group profile info
      mixpanel.get_group('groupId', currentGroup.id).set({
        $location: currentGroup.location,
        $name: currentGroup.name,
        type: currentGroup.type
      })
    }
  }, [currentGroup?.id, currentGroup?.location, currentGroup?.name, currentGroup?.type, memberships])

  useEffect(() => {
    (async function () {
      if (currentGroupSlug) {
        setCurrentGroupLoading(true)
        await dispatch(fetchForGroup(currentGroupSlug))
        setCurrentGroupLoading(false)
      }
    })()
  }, [dispatch, currentGroupSlug])

  // Scroll to top of center column when context, groupSlug, or view changes (from `pathMatchParams`)
  useEffect(() => {
    const centerColumn = document.getElementById(CENTER_COLUMN_ID)
    if (centerColumn) centerColumn.scrollTop = 0
  }, [pathMatchParams?.context, pathMatchParams?.groupSlug, pathMatchParams?.view])

  if (currentUserLoading) {
    return (
      <div className={classes.container} data-testid='loading-screen'>
        <Loading type='loading-fullscreen' />
      </div>
    )
  }

  // Layout props, flags, and event handlers
  const intercomProps = {
    hideDefaultLauncher: true,
    userHash: currentUser.intercomHash,
    email: currentUser.email,
    name: currentUser.name,
    userId: currentUser.id
  }
  const handleCloseDrawer = () => isDrawerOpen && dispatch(toggleDrawerAction())
  const showMenuBadge = some(m => m.newPostCount > 0, memberships)
  const collapsedState = hasDetail || (isMapView && hideDrawer)
  const isSingleColumn = (currentGroupSlug && !currentGroupMembership) ||
    matchPath({ path: '/members/:personId' }, location.pathname)
  // When joining a group by invitation Group Welcome Modal (join form)
  const showTourPrompt = !signupInProgress &&
    !get('settings.alreadySeenTour', currentUser) &&
    // Show group welcome modal before tour
    !get('settings.showJoinForm', currentGroupMembership) &&
    // Don't show tour on non-member group details page
    !isSingleColumn

  if (!signupInProgress && returnToPath) {
    const returnToPathName = new URL(returnToPath, 'https://hylo.com')?.pathname
    if (location.pathname === returnToPathName) {
      dispatch(setReturnToPath())
    } else {
      return <Navigate to={returnToPath} />
    }
  }

  if (signupInProgress && !isWelcomeContext) {
    return <Navigate to='/welcome' replace />
  }

  if (!currentGroupMembership && hasDetail && paramPostId && currentGroupSlug) {
    /* There are times when users will be send to a path where they have access to the POST on that path but not to the GROUP on that path
      This redirect replaces the non-accessible groupSlug from the path with '/all', for a better UI experience
    */
    return <Navigate to={postUrl(paramPostId, { context: 'all', groupSlug: null })} />
  }

  if (currentGroupSlug && !currentGroup && !currentGroupLoading) {
    return <NotFound />
  }

  return (
    <IntercomProvider appId={isTest ? '' : config.intercom.appId} autoBoot autoBootProps={intercomProps}>
      <Helmet>
        <title>{currentGroup ? `${currentGroup.name} | ` : ''}Hylo</title>
        <meta name='description' content='Prosocial Coordination for a Thriving Planet' />
        <script id='greencheck' type='application/json'>
          {`{ 'id': '${currentUser.id}', 'fullname': '${currentUser.name}', 'description': '${currentUser.tagline}', 'image': '${currentUser.avatarUrl}' }`}
        </script>
      </Helmet>

      <Routes>
        {/* Redirects for switching into global contexts, since these pages don't exist yet */}
        <Route path='/:context(public)/(members|settings)' element={<Navigate to='/public' replace />} />
        <Route path='/:context(all)/(members|settings)' element={<Navigate to='/all' replace />} />
        {/* Redirect manage notifications page to settings page when logged in */}
        <Route path='/notifications)' element={<Navigate to='/settings/notifications' replace />} />

        {/* First time viewing a group redirect to explore page */}
        {currentGroupMembership && !get('lastViewedAt', currentGroupMembership) && (
          <Route path='/:context(groups)/:groupSlug' element={<Navigate to={`/groups/${currentGroupSlug}/explore`} replace />} />
        )}

        {!isWebView() && (
          <>
            <Route path='/:context(groups)/:groupSlug/*' element={<GroupWelcomeModal />} />

            {showTourPrompt && (
              <Route path='/:context(all|public|groups)/*' element={<SiteTour windowWidth={width} />} />
            )}
          </>
        )}
      </Routes>

      {!withoutNav && (
        <>
          {/* Depends on `pathMatchParams` */}
          <TopNav className={classes.top} onClick={handleCloseDrawer} {...{ group: currentGroup, currentUser, routeParams: pathMatchParams, showMenuBadge, width }} />
          {isDrawerOpen && <Drawer className={cx(classes.drawer)} group={currentGroup} />}
        </>
      )}

      <Routes>
        <Route path='/groups/:groupSlug/topics/:topicName/create' element={<CreateModal />} />
        <Route path='/groups)/:groupSlug/:view(map|events|projects|proposals)/create' element={<CreateModal />} />
        <Route path='/groups)/:groupSlug/create' element={<CreateModal />} />
        <Route path='/groups)/:groupSlug/*' element={<CreateModal />} />
        <Route path='/public/topics/:topicName/create' element={<CreateModal />} />
        <Route path='/all/topics/:topicName/create' element={<CreateModal />} />
        <Route path='/public/:view/create' element={<CreateModal />} />
        <Route path='/all)/:view/create' element={<CreateModal />} />
        <Route path='/my/:view/create' element={<CreateModal />} />
        <Route path='/public/create' element={<CreateModal />} />
        <Route path='/all/create' element={<CreateModal />} />
        {/* <Route path='/:context(public|all)/*' element={<CreateModal />} /> */}
        {/* TODO route: how? <Route path={`(.*)/${REQUIRED_EDIT_POST_MATCH}`} element={<CreateModal />} /> */}
      </Routes>

      <Div100vh className={cx(classes.container, { [classes.mapView]: isMapView, [classes.singleColumn]: isSingleColumn, [classes.detailOpen]: hasDetail })}>
        <div ref={resizeRef} className={cx(classes.main, { [classes.mapView]: isMapView, [classes.withoutNav]: withoutNav, [classes.mainPad]: !withoutNav })} onClick={handleCloseDrawer}>
          {/* View navigation menu */}
          {(params.context !== 'groups' || (currentGroup && !currentGroupMembership)) && (
            <Routes>
              <Route
                path='groups/:groupSlug/*'
                element={
                  <Navigation
                    group={currentGroup}
                    collapsed={collapsedState}
                    className={cx(classes.left, { [classes.mapView]: isMapView, [classes.hidden]: !isGroupMenuOpen })}
                    mapView={isMapView}
                  />
                }
              />
              <Route
                path='all/*'
                element={
                  <Navigation
                    group={currentGroup}
                    collapsed={collapsedState}
                    className={cx(classes.left, { [classes.mapView]: isMapView, [classes.hidden]: !isGroupMenuOpen })}
                    mapView={isMapView}
                  />
                }
              />
              <Route
                path='public/*'
                element={
                  <Navigation
                    group={currentGroup}
                    collapsed={collapsedState}
                    className={cx(classes.left, { [classes.mapView]: isMapView, [classes.hidden]: !isGroupMenuOpen })}
                    mapView={isMapView}
                  />
                }
              />
              <Route
                path='my/*'
                element={
                  <Navigation
                    group={currentGroup}
                    collapsed={collapsedState}
                    className={cx(classes.left, { [classes.mapView]: isMapView, [classes.hidden]: !isGroupMenuOpen })}
                    mapView={isMapView}
                  />
                }
              />
            </Routes>
          )}
          <div className={cx(classes.center, { [classes.fullWidth]: hideSidebar, [classes.collapsedState]: collapsedState, [classes.withoutNav]: withoutNav })} id={CENTER_COLUMN_ID}>
            {/* NOTE: It could be more clear to group the following switched routes by component  */}
            <Routes>
              {/* **** Member Routes **** */}
              <Route path='/members/:personId/*' element={<MemberProfile isSingleColumn={isSingleColumn} />} />
              <Route path='/all/members/:personId/*' element={<MemberProfile />} />
              {/* **** All and Public Routes **** */}
              <Route path='all/stream/*' element={<Stream context='all' />} />
              <Route path='public/stream/*' element={<Stream context='public' />} />
              <Route path='all/projects/*' element={<Stream context='all' view='projects' />} />
              <Route path='public/projects/*' element={<Stream context='public' view='projects' />} />
              <Route path='all/proposals/*' element={<Stream context='all' view='proposals' />} />
              <Route path='public/proposals/*' element={<Stream context='public' view='proposals' />} />
              <Route path='all/events/*' element={<Events context='all' />} />
              <Route path='public/events/*' element={<Events context='public' />} />
              <Route path='all/map/*' element={<MapExplorer context='all' />} />
              <Route path='public/map/*' element={<MapExplorer context='public' />} />
              <Route path='public/groups/*' element={<GroupExplorer />} />
              <Route path='all/topics/:topicName' element={<Stream context='all' />} />
              <Route path='public/topics/:topicName' element={<Stream context='public' />} />
              <Route path='all/topics' element={<AllTopics />} />
              <Route path='all/*' element={returnDefaultView(false, 'all')} />
              <Route path='public/*' element={returnDefaultView(false, 'public')} />
              {/* **** Group Routes **** */}
              <Route path='groups/:joinGroupSlug/join/:accessCode' element={<JoinGroup />} />
              <Route path='h/use-invitation' element={<JoinGroup />} />
              {currentGroupLoading && (
                <Route path='groups/:groupSlug' element={<Loading />} />
              )}
              {/* When viewing a group you are not a member of show group detail page */}
              {currentGroupSlug && !currentGroupMembership && (
                <Route path='groups/:groupSlug' element={<GroupDetail context='groups' group={currentGroup} />} />
              )}
              <Route path='groups/:groupSlug/map/*' element={<MapExplorer context='groups' view='map' />} />
              <Route path='groups/:groupSlug/stream/*' element={<Stream context='groups' view='stream' />} />
              <Route path='groups/:groupSlug/proposals/*' element={<Stream context='groups' view='proposals' />} />
              <Route path='groups/:groupSlug/explore/*' element={<LandingPage context='groups' />} />
              <Route path='groups/:groupSlug/projects/*' element={<Stream context='groups' view='projects' />} />
              <Route path='groups/:groupSlug/custom/:customViewId/*' element={<Stream context='groups' view='custom' />} />
              <Route path='groups/:groupSlug/events/*' element={<Events context='groups' view='events' />} />
              <Route path='groups/:groupSlug/groups' element={<Groups context='groups' />} />
              <Route path='groups/:groupSlug/members/create' element={<Members context='groups' />} />
              <Route path='groups/:groupSlug/members/:personId/*' element={<MemberProfile context='groups' />} />
              <Route path='groups/:groupSlug/members' element={<Members context='groups' />} />
              <Route path='groups/:groupSlug/topics/:topicName/*' element={<ChatRoom context='groups' />} />
              <Route path='groups/:groupSlug/topics' element={<AllTopics context='groups' />} />
              <Route path='groups/:groupSlug/settings' element={<GroupSettings context='groups' />} />
              <Route path='groups/:groupSlug/*' element={returnDefaultView('groups', currentGroup)} />
              <Route path='post/:postId/*' element={<PostDetail />} />
              {/* **** My Routes **** */}
              <Route path='my/:view' element={<Stream />} />
              <Route path='my' render={props => <Navigate to='/my/posts' replace />} />
              {/* **** Other Routes **** */}
              <Route path='welcome' element={<WelcomeWizardRouter />} />
              <Route path='messages/:messageThreadId' element={<Messages />} />
              <Route path='settings' element={<UserSettings />} />
              <Route path='search' element={<Search />} />
              {/* **** Default Route (404) **** */}
              <Route path='*' element={<Navigate to={lastViewedGroup ? `/groups/${lastViewedGroup.slug}` : '/all'} replace />} />
            </Routes>
          </div>
          {(currentGroup && currentGroupMembership) && (
            <div className={cx(classes.sidebar, { [classes.hidden]: (hasDetail || hideSidebar) })}>
              <Routes>
                <Route
                  path='groups/:groupSlug/:view/*'
                  element={<GroupSidebar />}
                />
                <Route
                  path='groups/:groupSlug/topics/:topicName/*'
                  element={<GroupSidebar />}
                />
                <Route
                  path='groups/:groupSlug/*'
                  element={<GroupSidebar />}
                />
              </Routes>
            </div>
          )}
          <div className={cx(classes.detail, { [classes.hidden]: !hasDetail })} id={DETAIL_COLUMN_ID}>
            <Routes>
              {/* All context routes */}
              <Route path={`/all/events/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />
              <Route path={`/all/explore/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />
              <Route path={`/all/groups/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />
              <Route path={`/all/map/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />
              <Route path={`/all/projects/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />
              <Route path={`/all/stream/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />
              <Route path={`/all/topics/:topicName/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />
              <Route path={`/all/map/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='all' />} />
              <Route path={`/all/members/:personId/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />
              <Route path={`/all/${POST_DETAIL_MATCH}`} element={<PostDetail context='all' />} />

              {/* Public context routes */}
              <Route path={`/public/events/${POST_DETAIL_MATCH}`} element={<PostDetail context='public' />} />
              <Route path={`/public/explore/${POST_DETAIL_MATCH}`} element={<PostDetail context='public' />} />
              <Route path={`/public/groups/${POST_DETAIL_MATCH}`} element={<PostDetail context='public' />} />
              <Route path={`/public/map/${POST_DETAIL_MATCH}`} element={<PostDetail context='public' />} />
              <Route path={`/public/projects/${POST_DETAIL_MATCH}`} element={<PostDetail context='public' />} />
              <Route path={`/public/stream/${POST_DETAIL_MATCH}`} element={<PostDetail context='public' />} />
              <Route path={`/public/topics/:topicName/${POST_DETAIL_MATCH}`} element={<PostDetail context='public' />} />
              <Route path={`/public/map/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='public' />} />
              <Route path={`/public/groups/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='public' />} />
              <Route path={`/public/${POST_DETAIL_MATCH}`} element={<PostDetail context='public' />} />

              {/* My context routes */}
              <Route path={`/my/mentions/${POST_DETAIL_MATCH}`} element={<PostDetail context='my' />} />
              <Route path={`/my/interactions/${POST_DETAIL_MATCH}`} element={<PostDetail context='my' />} />
              <Route path={`/my/posts/${POST_DETAIL_MATCH}`} element={<PostDetail context='my' />} />
              <Route path={`/my/announcements/${POST_DETAIL_MATCH}`} element={<PostDetail context='my' />} />

              {/* Groups context routes */}
              <Route path={`/groups/:groupSlug/events/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/explore/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/map/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/projects/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/stream/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/proposals/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/custom/:customViewId/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/custom/:customViewId/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/members/:personId/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/events/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/explore/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/groups/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/map/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/projects/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/stream/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/topics/:topicName/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/${POST_DETAIL_MATCH}`} element={<PostDetail context='groups' />} />
              <Route path={`/groups/:groupSlug/${GROUP_DETAIL_MATCH}`} element={<GroupDetail context='groups' />} />

              {/* Other routes */}
              <Route path={`/members/:personId/${POST_DETAIL_MATCH}`} element={<PostDetail />} />
            </Routes>
          </div>
          <SocketListener location={location} groupSlug={currentGroupSlug} />
          <SocketSubscriber type='group' id={get('slug', currentGroup)} />
        </div>
      </Div100vh>
    </IntercomProvider>
  )
}

export function returnDefaultView (group, context) {
  if (!group) return <Stream context={context} />

  switch (group.type) {
    case GROUP_TYPES.farm:
      return <LandingPage />
    default:
      return <Stream context='groups' />
  }
}
