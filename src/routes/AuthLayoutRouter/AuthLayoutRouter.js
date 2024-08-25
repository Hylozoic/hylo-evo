import React, { useEffect, useMemo, useRef, useState } from 'react'
import { matchPath, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import { IntercomProvider } from 'react-use-intercom'
// import { Helmet } from 'react-helmet'
import Div100vh from 'react-div-100vh'
// import { some } from 'lodash/fp'
// import { useResizeDetector } from 'react-resize-detector'
import cx from 'classnames'
// import mixpanel from 'mixpanel-browser'
// import config, { isTest } from 'config'
import isWebView from 'util/webView'
// import { localeLocalStorageSync } from 'util/locale'
import { useLayoutFlags } from 'contexts/LayoutFlagsContext'
import getReturnToPath from 'store/selectors/getReturnToPath'
// import setReturnToPath from 'store/actions/setReturnToPath'
// import fetchCommonRoles from 'store/actions/fetchCommonRoles'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
// import fetchForGroup from 'store/actions/fetchForGroup'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
// import getMyMemberships from 'store/selectors/getMyMemberships'
import getMyGroupMembership from 'store/selectors/getMyGroupMembership'
import { getSignupInProgress } from 'store/selectors/getAuthState'
// import { toggleDrawer as toggleDrawerAction } from './AuthLayoutRouter.store'
import {
  POST_DETAIL_MATCH, GROUP_DETAIL_MATCH, postUrl
} from 'util/navigation'
import { CENTER_COLUMN_ID } from 'util/scrolling'
// import Stream from 'routes/Stream'
// import LandingPage from 'routes/LandingPage'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
// import SocketListener from 'components/SocketListener'
// import SocketSubscriber from 'components/SocketSubscriber'
// import TopNav from './components/TopNav'

// import { GROUP_TYPES } from 'store/models/Group'
import './AuthLayoutRouter.scss'

export default function AuthLayoutRouter (props) {
  const resizeRef = useRef()
  // const { width } = useResizeDetector({ handleHeight: false, targetRef: resizeRef })

  const { hideNavLayout } = useLayoutFlags()
  const withoutNav = isWebView() || hideNavLayout

  // Setup `pathMatchParams` and `queryParams` (`matchPath` best only used in this section)
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
  const hideSidebar = isMapView || pathMatchParams?.view === 'topics'
  const isWelcomeContext = pathMatchParams?.context === 'welcome'
  const queryParams = Object.fromEntries(new URLSearchParams(location.search))
  const hideDrawer = queryParams?.hideDrawer !== 'true'
  // Store
  const dispatch = useDispatch()
  const currentGroup = useSelector(state => getGroupForCurrentRoute(state, { match: { params: pathMatchParams } }))
  const currentGroupMembership = useSelector(state => getMyGroupMembership(state, { match: { params: pathMatchParams } }))
  const currentUser = useSelector(getMe)
  // const isDrawerOpen = useSelector(state => get('AuthLayoutRouter.isDrawerOpen', state))
  // const memberships = useSelector(getMyMemberships)
  const returnToPath = useSelector(getReturnToPath)
  const signupInProgress = useSelector(getSignupInProgress)

  const [currentUserLoading, setCurrentUserLoading] = useState(true)
  const [currentGroupLoading, setCurrentGroupLoading] = useState()

  useEffect(() => {
    (async function () {
      // await dispatch(fetchCommonRoles())
      await dispatch(fetchForCurrentUser())
      setCurrentUserLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (currentUser?.id) {
      // mixpanel.identify(currentUser.id)
      // mixpanel.people.set({
      //   $name: currentUser.name,
      //   $email: currentUser.email,
      //   $location: currentUser.location
      // })

      // if (currentUser?.settings?.locale) localeLocalStorageSync(currentUser?.settings?.locale)
    }
  }, [currentUser?.id])

  useEffect(() => {
    // Add all current group membershps to mixpanel user
    // mixpanel.set_group('groupId', memberships.map(m => m.group.id))

    if (currentGroup?.id) {
      // Setup group profile info
      // mixpanel.get_group('groupId', currentGroup.id).set({
      //   $location: currentGroup.location,
      //   $name: currentGroup.name,
      //   type: currentGroup.type
      // })
    }
  }, [currentGroup?.id])

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

  // Layout props, flags, and event handlers
  // const intercomProps = {
  //   hideDefaultLauncher: true,
  //   userHash: currentUser.intercomHash,
  //   email: currentUser.email,
  //   name: currentUser.name,
  //   userId: currentUser.id
  // }
  // const handleCloseDrawer = () => isDrawerOpen && dispatch(toggleDrawerAction())
  // const showMenuBadge = some(m => m.newPostCount > 0, memberships)
  const collapsedState = hasDetail || (isMapView && hideDrawer)
  const isSingleColumn = (currentGroupSlug && !currentGroupMembership) ||
    matchPath(location.pathname, '/members/:personId')
  // When joining a group by invitation Group Welcome Modal (join form)

  if (!signupInProgress && returnToPath) {
    const returnToPathName = new URL(returnToPath, 'https://hylo.com')?.pathname
    if (location.pathname === returnToPathName) {
      // dispatch(setReturnToPath())
    } else {
      return <Redirect push to={returnToPath} />
    }
  }

  if (signupInProgress && !isWelcomeContext) {
    return <Redirect to='/welcome' />
  }

  if (!currentGroupMembership && hasDetail && paramPostId && currentGroupSlug) {
    /* There are times when users will be send to a path where they have access to the POST on that path but not to the GROUP on that path
      This redirect replaces the non-accessible groupSlug from the path with '/all', for a better UI experience
    */
    return <Redirect push to={postUrl(paramPostId, { context: 'all', groupSlug: null })} />
  }

  if (currentGroupSlug && !currentGroup && !currentGroupLoading) {
    return <NotFound />
  }

  return (
    <Div100vh styleName={cx('container', { 'map-view': isMapView, singleColumn: isSingleColumn, detailOpen: hasDetail })}>
      <div ref={resizeRef} styleName={cx('main', { 'map-view': isMapView, withoutNav, 'main-pad': !withoutNav })} >
        {/* View navigation menu */}
        {/* <Route
          path={[
            '/:context(groups)/:groupSlug/:view?',
            '/:context(all|public|my)/:view?'
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
        /> */}
        <div styleName={cx('center', { 'full-width': hideSidebar, collapsedState, withoutNav })} id={CENTER_COLUMN_ID}>
          {/* NOTE: It could be more clear to group the following switched routes by component  */}
          {/* <Switch>
            <Route
              path={`/:view(members)/:personId/${OPTIONAL_POST_MATCH}`}
              render={routeProps => (
                <MemberProfile {...routeProps} isSingleColumn={isSingleColumn} />
              )}
            />
            <Route path={`/:context(all)/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} component={MemberProfile} />
            <Route path={`/:context(all|public)/:view(stream)/${OPTIONAL_POST_MATCH}`} component={Stream} />
            <Route path={`/:context(all|public)/:view(projects)/${OPTIONAL_POST_MATCH}`} component={Stream} />
            <Route path={`/:context(all|public)/:view(proposals)/${OPTIONAL_POST_MATCH}`} component={Stream} />
            <Route path={`/:context(all|public)/:view(events)/${OPTIONAL_POST_MATCH}`} component={Events} />
            <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_POST_MATCH}`} component={MapExplorer} />
            <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_GROUP_MATCH}`} component={MapExplorer} />
            <Route path={`/:context(public)/:view(groups)/${OPTIONAL_GROUP_MATCH}`} component={GroupExplorer} />
            <Route path={`/:context(public)/:view(groups)/${OPTIONAL_POST_MATCH}`} component={GroupExplorer} />
            <Route path='/:context(all|public)/:view(topics)/:topicName' component={Stream} />
            <Route path='/:context(all)/:view(topics)' component={AllTopics} />
            <Route path={`/:context(all|public)/${OPTIONAL_POST_MATCH}`} component={returnDefaultRouteForGroup(currentGroup)} />
            <Route path={['/groups/:joinGroupSlug/join/:accessCode', '/h/use-invitation']} component={JoinGroup} />
            {currentGroupLoading && (
              <Route path='/:context(groups)/:groupSlug' component={Loading} />
            )}
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
            <Route path={`/:context(groups)/:groupSlug/:view(stream)/${GROUP_DETAIL_MATCH}`} component={Stream} />
            <Route path={`/:context(groups)/:groupSlug/:view(proposals)/${OPTIONAL_POST_MATCH}`} component={Stream} />
            <Route path={`/:context(groups)/:groupSlug/:view(explore)/${GROUP_DETAIL_MATCH}`} exact component={LandingPage} />
            <Route path={`/:context(groups)/:groupSlug/:view(explore)/${OPTIONAL_POST_MATCH}`} component={LandingPage} />
            <Route path={`/:context(groups)/:groupSlug/:view(projects)/${GROUP_DETAIL_MATCH}`} component={Stream} />
            <Route path={`/:context(groups)/:groupSlug/:view(projects)/${OPTIONAL_POST_MATCH}`} component={Stream} />
            <Route path={`/:context(groups)/:groupSlug/:view(custom)/:customViewId/${GROUP_DETAIL_MATCH}`} component={Stream} />
            <Route path={`/:context(groups)/:groupSlug/:view(custom)/:customViewId/${OPTIONAL_POST_MATCH}`} component={Stream} />
            <Route path={`/:context(groups)/:groupSlug/:view(events)/${GROUP_DETAIL_MATCH}`} component={Events} />
            <Route path={`/:context(groups)/:groupSlug/:view(events)/${OPTIONAL_POST_MATCH}`} component={Events} />
            <Route path='/:context(groups)/:groupSlug/:view(groups)' component={Groups} />
            <Route path='/:context(groups)/:groupSlug/:view(members)/create' component={Members} />
            <Route path={`/:context(groups)/:groupSlug/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} component={MemberProfile} />
            <Route path='/:context(groups)/:groupSlug/:view(members)' component={Members} />
            <Route path={`/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}`} component={ChatRoom} />
            <Route path='/:context(groups)/:groupSlug/:view(topics)' component={AllTopics} />
            <Route path='/:context(groups)/:groupSlug/:view(settings)' component={GroupSettings} />
            <Route path={`/:context(groups)/:groupSlug/${GROUP_DETAIL_MATCH}`} exact component={returnDefaultRouteForGroup(currentGroup)} />
            <Route path={`/:context(groups)/:groupSlug/${POST_DETAIL_MATCH}`} exact component={returnDefaultRouteForGroup(currentGroup)} />
            <Route path='/:context(groups)/:groupSlug' component={returnDefaultRouteForGroup(currentGroup)} />
            <Route path={`/${POST_DETAIL_MATCH}`} component={PostDetail} />
            <Route path='/:context(my)/:view(mentions|interactions|posts|announcements)' component={Stream} />
            <RedirectRoute exact path='/my' to='/my/posts' />
            <Route path='/welcome' component={WelcomeWizardRouter} />
            <Route path='/messages/:messageThreadId?' render={routeProps => <Messages {...routeProps} />} />
            <Route path='/settings' component={UserSettings} />
            <Route path='/search' component={Search} />
            <Redirect to={lastViewedGroup ? `/groups/${lastViewedGroup.slug}` : '/all'} />
          </Switch> */}
        </div>
      </div>
    </Div100vh>
  )
}

// export function returnDefaultRouteForGroup (group) {
//   if (!group) return Stream

//   switch (group.type) {
//     case GROUP_TYPES.farm:
//       return LandingPage
//     default:
//       return Stream
//   }
// }
