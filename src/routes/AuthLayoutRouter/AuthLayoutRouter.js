import React, { useEffect, useMemo, useRef, useState } from 'react'
import { matchPath, Redirect, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { IntercomProvider } from 'react-use-intercom'
import Div100vh from 'react-div-100vh'
import { get, some } from 'lodash/fp'
import { useResizeDetector } from 'react-resize-detector'
import cx from 'classnames'
import mixpanel from 'mixpanel-browser'
import config, { isTest } from 'config'
import isWebView from 'util/webView'
import { useLayoutFlags } from 'contexts/LayoutFlagsContext'
import getReturnToPath from 'store/selectors/getReturnToPath'
import setReturnToPath from 'store/actions/setReturnToPath'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import fetchForGroup from 'store/actions/fetchForGroup'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
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
import RedirectRoute from 'router/RedirectRoute'
import AllTopics from 'routes/AllTopics'
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
import checkIsPostPublic from 'store/actions/checkIsPostPublic'
import SocketListener from 'components/SocketListener'
import SocketSubscriber from 'components/SocketSubscriber'
import TopNav from './components/TopNav'

import UserSettings from 'routes/UserSettings'
import { GROUP_TYPES } from 'store/models/Group'
import './AuthLayoutRouter.scss'

export default function AuthLayoutRouter (props) {
  const resizeRef = useRef()
  const { width } = useResizeDetector({ handleHeight: false, targetRef: resizeRef })

  const { hideNavLayout } = useLayoutFlags()
  const withoutNav = isWebView() || hideNavLayout

  // Setup `pathMatchParams` and `queryParams` (`matchPath` best only used in this section)
  const location = props.location
  const pathMatchParams = useMemo(() => (
    matchPath(location.pathname, [
      `/${POST_DETAIL_MATCH}`,
      '/groups/:joinGroupSlug/join/:accessCode',
      '/:context(groups)/:groupSlug/:view(events|groups|map|members|projects|settings|stream|topics|custom)?',
      '/:context(all|public)/:view(events|groups|map|members|projects|settings|stream|topics)?',
      '/:context(all|welcome)'
    ])?.params || { context: 'all' }
  ), [location.pathname])
  const hasDetail = !!matchPath(location.pathname, [
    `/(.*)/${POST_DETAIL_MATCH}`,
    `/(.*)/${GROUP_DETAIL_MATCH}`
  ])

  const paramPostId = matchPath(location.pathname, [
    `/:context(groups)/:groupSlug/${POST_DETAIL_MATCH}`,
    `/:context(groups)/:groupSlug/:view(events|groups|map|members|projects|settings|stream|topics|custom)/${POST_DETAIL_MATCH}`
  ])?.params?.postId
  const currentGroupSlug = pathMatchParams?.groupSlug
  const isMapView = pathMatchParams?.view === 'map'
  const isWelcomeContext = pathMatchParams?.context === 'welcome'
  const queryParams = Object.fromEntries(new URLSearchParams(location.search))
  const hideDrawer = queryParams?.hideDrawer !== 'true'

  // Store
  const dispatch = useDispatch()
  const currentGroup = useSelector(state => getGroupForCurrentRoute(state, { match: { params: pathMatchParams } }))
  const currentGroupMembership = useSelector(state => getMyGroupMembership(state, { match: { params: pathMatchParams } }))
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
      await dispatch(fetchForCurrentUser())
      setCurrentUserLoading(false)
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
    }
  }, [currentUser?.id])

  useEffect(() => {
    (async function () {
      if (currentGroupSlug) {
        setCurrentGroupLoading(true)
        await dispatch(fetchForGroup(currentGroupSlug))
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
    matchPath(location.pathname, '/members/:personId')
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
      return <Redirect push to={returnToPath} />
    }
  }

  if (signupInProgress && !isWelcomeContext) {
    return <Redirect to='/welcome' />
  }

  /* 
    So!
    - We have a user, and their groupMemberships
    - We have a path, with a groupSlug and post id
    - We have a post, and its attached groups

    If the groupSlug in the path isn't in the users groupMemberships, we need action!
    - then we check all of the post's groups and all of the users groups, looking for a match (any match?)
    - if there is a match, we redirect? or we replace the groupSlug?
    - if there is no match, and the post is public, we redirect to `/public`
  */

    // useEffect(() => {
    //   (async function () {
    //     if (!currentGroupMembership && hasDetail && paramPostId && currentGroupSlug) {
    //       setPublicPostCheckLoading(true)
    //       const result = await dispatch(checkIsPostPublic(paramPostId))
    //       const isPublicPost = result?.payload?.data?.post?.id
    //       setPublicPostCheckLoading(false)
    //       return <Redirect push to={postUrl(paramPostId, { ...pathMatchParams, context: isPublicPost ? 'public' : 'all', groupSlug: null })} />
    //     }
    //   })()
    // }, [paramPostId, currentGroupMembership, hasDetail, currentGroupSlug])

  
  if (!currentGroupMembership && hasDetail && paramPostId && currentGroupSlug) {
    // this covers "Post I can see, and groupSlug for a group I cannot access." But it does not necessarily cover "Post I can see because its Public, but that isn't posted to any groups I have membership of"
    return <Redirect push to={postUrl(paramPostId, { ...pathMatchParams, context: 'all', groupSlug: null })} />
  }

  if (currentGroupSlug && !currentGroup && !currentGroupLoading) { // this will have to be pushed down the hierarchy in the routers
    return <NotFound />
  }

  return (
    <IntercomProvider appId={isTest ? '' : config.intercom.appId} autoBoot autoBootProps={intercomProps}>
      {/* Redirects for switching into global contexts, since these pages don't exist yet */}
      <RedirectRoute exact path='/:context(public)/(members|settings)' to='/public' />
      <RedirectRoute exact path='/:context(all)/(members|settings)' to='/all' />
      {/* First time viewing a group redirect to explore page */}
      {currentGroupMembership && !get('lastViewedAt', currentGroupMembership) && (
        <RedirectRoute exact path='/:context(groups)/:groupSlug' to={`/groups/${currentGroupSlug}/explore`} />
      )}

      {!isWebView() && (
        <>
          <Route path='/:context(groups)/:groupSlug' render={routeProps => <GroupWelcomeModal {...routeProps} />} />

          {showTourPrompt && (
            <Route path='/:context(all|public|groups)' render={() => <SiteTour windowWidth={width} />} />
          )}
        </>
      )}

      {!withoutNav && (
        <>
          {/* Depends on `pathMatchParams` */}
          <TopNav styleName='top' onClick={handleCloseDrawer} {...{ group: currentGroup, currentUser, routeParams: pathMatchParams, showMenuBadge, width }} />
          {isDrawerOpen && (
            <Route
              path={[
                // NOTE: These routes can likely be reduced to: [`(.*)/${OPTIONAL_POST_MATCH}`, `(.*)/${OPTIONAL_GROUP_MATCH}`, ...]`
                `/:context(all|public)/:view(events|explore|map|projects|stream)/${OPTIONAL_POST_MATCH}`,
                `/:context(public)/:view(group)/${OPTIONAL_GROUP_MATCH}`,
                `/:context(all|public)/:view(map)/${OPTIONAL_GROUP_MATCH}`,
                `/:context(all|public)/${OPTIONAL_POST_MATCH}`,
                '/:context(all)/:view(topics)/:topicName',
                '/:context(all)/:view(topics)',
                `/:context(groups)/:groupSlug/:view(members)/:personId/${OPTIONAL_POST_MATCH}`,
                `/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}`,
                `/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_GROUP_MATCH}`,
                `/:context(groups)/:groupSlug/:view(events|explore|groups|map|members|projects|settings|stream|topics)/${OPTIONAL_POST_MATCH}`,
                `/:context(groups)/:groupSlug/:view(custom)/:customViewId/${OPTIONAL_POST_MATCH}`,
                `/:context(groups)/:groupSlug/${OPTIONAL_POST_MATCH}`,
                `/:view(members)/:personId/${OPTIONAL_POST_MATCH}`,
                `/${POST_DETAIL_MATCH}`,
                '/messages',
                '/settings',
                '/search',
                '/confirm-group-delete'
              ]}
              component={routeProps => (
                <Drawer {...routeProps} styleName={cx('drawer')} group={currentGroup} />
              )}
            />
          )}
        </>
      )}

      <Route
        path={[
          '/:context(groups)/:groupSlug/:view(topics)/:topicName/create',
          '/:context(groups)/:groupSlug/:view(map|events|projects)/create',
          '/:context(groups)/:groupSlug/create',
          '/:context(groups)/:groupSlug/(.*)/create',
          '/:context(public|all)/:view(topics)/:topicName/create',
          '/:context(public|all)/:view(map|events|projects)/create',
          '/:context(public|all)/create',
          '/:context(public|all)/(.*)/create',
          `(.*)/${REQUIRED_EDIT_POST_MATCH}`
        ]}
        component={CreateModal}
      />

      <Div100vh styleName={cx('container', { 'map-view': isMapView, singleColumn: isSingleColumn, detailOpen: hasDetail })}>
        <div ref={resizeRef} styleName={cx('main', { 'map-view': isMapView, withoutNav })} onClick={handleCloseDrawer}>
          {/* View navigation menu */}
          <Route
            path={[
              '/:context(groups)/:groupSlug/:view?',
              '/:context(all|public)/:view?'
            ]}
            component={routeProps => {
              if (routeProps.match.params.context === 'groups' && (!currentGroup || !currentGroupMembership)) return null

              return (
                <Navigation
                  {...routeProps}
                  group={currentGroup}
                  collapsed={collapsedState}
                  styleName={cx('left', { 'map-view': isMapView }, { hidden: !isGroupMenuOpen })}
                  mapView={isMapView}
                />
              )
            }}
          />
          <Div100vh styleName={cx('center', { 'map-view': isMapView, collapsedState, withoutNav })} id={CENTER_COLUMN_ID}>
            {/* NOTE: It could be more clear to group the following switched routes by component  */}
            <Switch>
              {/* **** Member Routes **** */}
              <Route
                path={`/:view(members)/:personId/${OPTIONAL_POST_MATCH}`}
                render={routeProps => (
                  <MemberProfile {...routeProps} isSingleColumn={isSingleColumn} />
                )}
              />
              <Route path={`/:context(all)/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} component={MemberProfile} />
              {/* **** All and Public Routes **** */}
              <Route path={`/:context(all|public)/:view(stream)/${OPTIONAL_POST_MATCH}`} component={Stream} />
              <Route path={`/:context(all|public)/:view(projects)/${OPTIONAL_POST_MATCH}`} component={Stream} />
              <Route path={`/:context(all|public)/:view(events)/${OPTIONAL_POST_MATCH}`} component={Events} />
              <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_POST_MATCH}`} component={MapExplorer} />
              <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_GROUP_MATCH}`} component={MapExplorer} />
              <Route path={`/:context(public)/:view(groups)/${OPTIONAL_GROUP_MATCH}`} component={GroupExplorer} />
              <Route path={`/:context(public)/:view(groups)/${OPTIONAL_POST_MATCH}`} component={GroupExplorer} />
              <Route path='/:context(all|public)/:view(topics)/:topicName' component={Stream} />
              <Route path='/:context(all)/:view(topics)' component={AllTopics} />
              <Route path={`/:context(all|public)/${OPTIONAL_POST_MATCH}`} component={returnDefaultRouteForGroup(currentGroup)} />
              {/* **** Group Routes **** */}
              <Route path={['/groups/:joinGroupSlug/join/:accessCode', '/h/use-invitation']} component={JoinGroup} />
              {currentGroupLoading && (
                <Route path='/:context(groups)/:groupSlug' component={Loading} />
              )}
              {/* When viewing a group you are not a member of show group detail page */}
              {currentGroupSlug && !currentGroupMembership && (
                <Route
                  path='/:context(groups)/:groupSlug'
                  render={routeProps => (
                    <GroupDetail {...routeProps} group={currentGroup} />
                  )}
                />
              )}
              <Route path={`/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_POST_MATCH}`} component={MapExplorer} />
              <Route path={`/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_GROUP_MATCH}`} component={MapExplorer} />
              <Route path={`/:context(groups)/:groupSlug/:view(stream)/${OPTIONAL_POST_MATCH}`} component={Stream} />
              <Route path={`/:context(groups)/:groupSlug/:view(explore)/${GROUP_DETAIL_MATCH}`} exact component={LandingPage} />
              <Route path={`/:context(groups)/:groupSlug/:view(explore)/${OPTIONAL_POST_MATCH}`} component={LandingPage} />
              <Route path={`/:context(groups)/:groupSlug/:view(projects)/${OPTIONAL_POST_MATCH}`} component={Stream} />
              <Route path={`/:context(groups)/:groupSlug/:view(custom)/:customViewId/${OPTIONAL_POST_MATCH}`} component={Stream} />
              <Route path={`/:context(groups)/:groupSlug/:view(events)/${OPTIONAL_POST_MATCH}`} component={Events} />
              <Route path='/:context(groups)/:groupSlug/:view(groups)' component={Groups} />
              <Route path='/:context(groups)/:groupSlug/:view(members)/create' component={Members} />
              <Route path={`/:context(groups)/:groupSlug/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} component={MemberProfile} />
              <Route path='/:context(groups)/:groupSlug/:view(members)' component={Members} />
              <Route path={`/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}`} component={Stream} />
              <Route path='/:context(groups)/:groupSlug/:view(topics)' component={AllTopics} />
              <Route path='/:context(groups)/:groupSlug/:view(settings)' component={GroupSettings} />
              <Route path={`/:context(groups)/:groupSlug/${POST_DETAIL_MATCH}`} exact component={returnDefaultRouteForGroup(currentGroup)} />
              <Route path='/:context(groups)/:groupSlug' component={returnDefaultRouteForGroup(currentGroup)} />
              <Route path={`/${POST_DETAIL_MATCH}`} component={PostDetail} />
              {/* **** Other Routes **** */}
              <Route path='/welcome' component={WelcomeWizardRouter} />
              <Route path='/messages/:messageThreadId?' render={routeProps => <Messages {...routeProps} />} />
              <Route path='/settings' component={UserSettings} />
              <Route path='/search' component={Search} />
              {/* **** Default Route (404) **** */}
              <Redirect to={lastViewedGroup ? `/groups/${lastViewedGroup.slug}` : '/all'} />
            </Switch>
          </Div100vh>
          {(currentGroup && currentGroupMembership) && (
            <div styleName={cx('sidebar', { hidden: (hasDetail || isMapView) })}>
              <Route
                path={[
                  `/:context(groups)/:groupSlug/:view(events|explore|map|groups|projects|stream)/${OPTIONAL_NEW_POST_MATCH}`,
                  `/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_NEW_POST_MATCH}`,
                  `/:context(groups)/:groupSlug/${OPTIONAL_NEW_POST_MATCH}`
                ]}
                component={GroupSidebar}
              />
            </div>
          )}
          <div styleName={cx('detail', { hidden: !hasDetail })} id={DETAIL_COLUMN_ID}>
            {/* NOTE: These routes could potentially be simply: `(.*)/${POST_DETAIL_MATCH}` and`(.*)/${GROUP_DETAIL_MATCH}` */}
            <Switch>
              <Route path={`/:context(all|public)/:view(events|explore|groups|map|projects|stream)/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(all|public)/:view(topics)/:topicName/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(all|public)/:view(map)/${GROUP_DETAIL_MATCH}`} component={GroupDetail} />
              <Route path={`/:context(public)/:view(groups)/${GROUP_DETAIL_MATCH}`} component={GroupDetail} />
              <Route path={`/:context(all)/:view(members)/:personId/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(all|public)/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(groups)/:groupSlug/:view(events|explore|map|projects|stream)/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(groups)/:groupSlug/:view(custom)/:customViewId/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(groups)/:groupSlug/:view(members)/:personId/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(groups)/:groupSlug/:view(explore|map|groups)/${GROUP_DETAIL_MATCH}`} component={GroupDetail} />
              <Route path={`/:context(groups)/:groupSlug/:view(topics)/:topicName/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(groups)/:groupSlug/${POST_DETAIL_MATCH}`} component={PostDetail} />
              <Route path={`/:context(groups)/:groupSlug/${GROUP_DETAIL_MATCH}`} component={GroupDetail} />
              <Route path={`/:view(members)/:personId/${POST_DETAIL_MATCH}`} component={PostDetail} />
            </Switch>
          </div>
        </div>
        <SocketListener location={location} />
        <SocketSubscriber type='group' id={get('slug', currentGroup)} />
      </Div100vh>
    </IntercomProvider>
  )
}

export function returnDefaultRouteForGroup (group) {
  if (!group) return Stream

  switch (group.type) {
    case GROUP_TYPES.farm:
      return LandingPage
    default:
      return Stream
  }
}
