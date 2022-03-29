
import cx from 'classnames'
import { get, isEqual, some } from 'lodash/fp'
import qs from 'querystring'
import React, { Component } from 'react'
import Intercom from 'react-intercom'
import {
  matchPath,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import Div100vh from 'react-div-100vh'
import config, { isTest } from 'config'
import LayoutFlagsContext from 'contexts/LayoutFlagsContext'
import {
  OPTIONAL_POST_MATCH, OPTIONAL_GROUP_MATCH,
  OPTIONAL_NEW_POST_MATCH, POST_DETAIL_MATCH, GROUP_DETAIL_MATCH,
  isWelcomePath,
  REQUIRED_EDIT_POST_MATCH
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
import Feed from 'routes/Feed'
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
import './AuthLayoutRouter.scss'

export default class AuthLayoutRouter extends Component {
  static contextType = LayoutFlagsContext

  componentDidMount () {
    this.props.fetchForCurrentUser()
    if (this.props.slug) {
      this.props.fetchForGroup(this.props.slug)
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.slug && this.props.slug !== prevProps.slug) {
      this.props.fetchForGroup(this.props.slug)
    }
    // NOTE: Relies on incoming `match.params` (currently provided by `RootRouter`)
    if (!isEqual(this.props.routeParams, prevProps.routeParams)) {
      this.scrollToTop()
    }
  }

  handleCloseDrawer = () => this.props.isDrawerOpen && this.props.toggleDrawer()

  scrollToTop = () => {
    const centerColumn = document.getElementById(CENTER_COLUMN_ID)
    if (centerColumn) {
      centerColumn.scrollTop = 0
    }
  }

  render () {
    const {
      currentGroupMembership,
      currentUser,
      currentUserPending,
      group,
      groupPending,
      isDrawerOpen,
      isGroupMenuOpen,
      lastViewedGroup,
      location,
      returnToPath,
      routeParams,
      setReturnToPath,
      showMenuBadge,
      signupInProgress,
      slug,
      width
    } = this.props

    if (currentUserPending) {
      return (
        <div styleName='container'>
          <Loading type='loading-fullscreen' />
        </div>
      )
    }

    if (!signupInProgress && returnToPath) {
      setReturnToPath()
      return (
        <Redirect to={returnToPath} />
      )
    }

    const defaultRedirectPath = signupInProgress
      // Equates to blank center column when `signupInProgress`
      ? null
      : lastViewedGroup
        ? `/groups/${lastViewedGroup.slug}`
        : '/all'

    // LEJ: When needing to breaking-out into `matchPath` I think it's most clear
    // and maintainable to do so directly in the router which otherwise routes
    // the same paths.
    if (
      matchPath('/groups/:groupSlug') &&
      !matchPath('groups/:groupSlug/join')
    ) {
      if (!group && !groupPending) return <NotFound />
    }

    const { mobileSettingsLayout } = this.context
    const withoutNav = mobileSettingsLayout
    const queryParams = qs.parse(location.search.substring(1))
    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, { path }),
      detailRoutes
    )
    // NOTE: Relies on incoming `match.params` (currently provided by `RootRouter`)
    const isMapView = routeParams.view === 'map'
    const collapsedState = hasDetail || (isMapView && queryParams.hideDrawer !== 'true')
    const isSingleColumn = (slug && !currentGroupMembership) || matchPath(location.pathname, { path: '/members/:personId' })
    const showTourPrompt = !signupInProgress &&
      !get('settings.alreadySeenTour', currentUser) &&
      !isSingleColumn && // Don't show tour on non-member group details page
      !get('settings.showJoinForm', currentGroupMembership) && // Show group welcome modal before tour
      !withoutNav

    return (
      <Div100vh styleName={cx('container', { 'map-view': isMapView, singleColumn: isSingleColumn, detailOpen: hasDetail })}>
        {/* **** Redirects (also see default route in center column and `returnToPath` handler above) **** */}
        {redirectRoutes.map(({ from, to }) => (
          <RedirectRoute exact path={from} to={to} key={from} />
        ))}
        {/* First time viewing a group redirect to explore page */}
        {(currentGroupMembership && !get('lastViewedAt', currentGroupMembership)) && (
          <RedirectRoute exact path='/:context(groups)/:groupSlug' to={`/groups/${currentGroupMembership.group.slug}/explore`} />
        )}
        {(signupInProgress && !isWelcomePath(location.pathname)) && (
          <RedirectRoute to='/welcome/upload-photo' />
        )}

        {showTourPrompt && (
          <Route path='/:context(all|public|groups)' render={() => <SiteTour windowWidth={this.props.width} />} />
        )}

        {!withoutNav && (
          <>
            <Route component={() => <DrawerRouter hidden={!isDrawerOpen} group={group} />} />
            {/* // NOTE: Relies on incoming `match.params` (currently provided by `RootRouter`)  */}
            <TopNav styleName='top' onClick={this.handleCloseDrawer} {...{ group, currentUser, routeParams, showMenuBadge, width }} />
          </>
        )}

        <Route
          path={[
            '/:context(groups)/:groupSlug/(.*)/create',
            '/:context(groups)/:groupSlug/create',
            '/:context(public|all)/(.*)/create',
            '/:context(public|all)/create',
            `(.*)/${REQUIRED_EDIT_POST_MATCH}`
          ]}
          component={CreateModal}
        />

        <div styleName={cx('main', { 'map-view': isMapView, withoutNav })} onClick={this.handleCloseDrawer}>
          {/* View navigation menu */}
          <Route
            path={[
              '/:context(groups)/:groupSlug/:view?',
              '/:context(all|public)/:view?'
            ]}
            component={routeProps => {
              // NOTE: Relies on incoming `match.params` (currently provided by `RootRouter`)
              if (routeProps.match.params.context === 'groups' && (!group || !currentGroupMembership)) return null

              return (
                <Navigation
                  {...routeProps}
                  collapsed={collapsedState}
                  styleName={cx('left', { 'map-view': isMapView }, { hidden: !isGroupMenuOpen })}
                  mapView={isMapView}
                />
              )
            }}
          />

          {/* When joining a group by invitation show join form */}
          {currentGroupMembership && get('settings.showJoinForm', currentGroupMembership) && (
            <Route path='/:context(groups)/:groupSlug' render={routeProps => <GroupWelcomeModal {...routeProps} group={group} />} />
          )}

          <Div100vh styleName={cx('center', { 'map-view': isMapView, collapsedState, withoutNav })} id={CENTER_COLUMN_ID}>
            <Switch>
              <Route path='/welcome' component={WelcomeWizardRouter} />
              {/* **** Member Routes **** */}
              <Route path={`/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} render={routeProps => <MemberProfile {...routeProps} isSingleColumn={isSingleColumn} />} />
              <Route path={`/:context(all)/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} component={MemberProfile} />
              {/* **** All and Public Routes **** */}
              <Route path={`/:context(all|public)/:view(stream)/${OPTIONAL_POST_MATCH}`} component={Stream} />
              <Route path={`/:context(all|public)/:view(projects)/${OPTIONAL_POST_MATCH}`} component={Feed} />
              <Route path={`/:context(all|public)/:view(events)/${OPTIONAL_POST_MATCH}`} component={Events} />
              <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_POST_MATCH}`} component={MapExplorer} />
              <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_GROUP_MATCH}`} component={MapExplorer} />
              <Route path={`/:context(public)/:view(groups)/${OPTIONAL_GROUP_MATCH}`} component={GroupExplorer} />
              <Route path='/:context(all|public)/:view(topics)/:topicName' component={Feed} />
              <Route path='/:context(all)/:view(topics)' component={AllTopics} />
              <Route path={`/:context(all|public)/${OPTIONAL_POST_MATCH}`} component={Stream} />
              {/* **** Group Routes **** */}
              <Route path={['/:context(groups)/:groupSlug/join/:accessCode', '/h/use-invitation']} component={JoinGroup} />
              {/* When viewing a group you are not a member of show group detail page */}
              {(slug && !currentGroupMembership) && (
                <Route path='/:context(groups)/:groupSlug' render={routeProps => <GroupDetail {...routeProps} group={group} />} />
              )}
              <Route path={`/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_POST_MATCH}`} component={MapExplorer} />
              <Route path={`/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_GROUP_MATCH}`} component={MapExplorer} />
              <Route path={`/:context(groups)/:groupSlug/:view(stream)/${OPTIONAL_POST_MATCH}`} component={Stream} />
              <Route path={`/:context(groups)/:groupSlug/:view(explore)/${GROUP_DETAIL_MATCH}`} exact component={LandingPage} />
              <Route path={`/:context(groups)/:groupSlug/:view(explore)/${OPTIONAL_POST_MATCH}`} component={LandingPage} />
              <Route path={`/:context(groups)/:groupSlug/:view(projects)/${OPTIONAL_POST_MATCH}`} component={Feed} />
              <Route path={`/:context(groups)/:groupSlug/:view(events)/${OPTIONAL_POST_MATCH}`} component={Events} />
              <Route path='/:context(groups)/:groupSlug/:view(groups)' component={Groups} />
              <Route path='/:context(groups)/:groupSlug/:view(members)/create' component={Members} />
              <Route path={`/:context(groups)/:groupSlug/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} component={MemberProfile} />
              <Route path='/:context(groups)/:groupSlug/:view(members)' component={Members} />
              <Route path={`/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}`} component={Feed} />
              <Route path='/:context(groups)/:groupSlug/:view(topics)' component={AllTopics} />
              <Route path='/:context(groups)/:groupSlug/:view(settings)' component={GroupSettings} />
              <Route path={`/:context(groups)/:groupSlug/${POST_DETAIL_MATCH}`} exact component={Stream} />
              <Route path='/:context(groups)/:groupSlug' component={Stream} />
              {/* **** Other Routes **** */}
              <Route path='/messages/:messageThreadId?' render={routeProps => <Messages {...routeProps} />} />
              <Route path='/settings' component={UserSettings} />
              <Route path='/search' component={Search} />
              {/* **** Default Route (404) **** */}
              {defaultRedirectPath && (
                <Redirect to={defaultRedirectPath} />
              )}
            </Switch>
          </Div100vh>
          {(group && currentGroupMembership) && (
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
            <Switch>
              {detailRoutes.map(({ path, component }) => (
                <Route path={path} component={component} key={path} />
              ))}
            </Switch>
          </div>
        </div>
        <SocketListener location={location} />
        <SocketSubscriber type='group' id={get('slug', group)} />
        <Intercom appID={isTest ? '' : config.intercom.appId} hide_default_launcher />
      </Div100vh>
    )
  }
}

export function DrawerRouter ({ group, hidden }) {
  if (hidden) return null

  return (
    <Route
      path={[
        // In order of more specific to less specific
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
        `/:context(groups)/:groupSlug/${OPTIONAL_POST_MATCH}`,
        `/:view(members)/:personId/${OPTIONAL_POST_MATCH}`,
        '/messages',
        '/settings',
        '/search',
        '/confirm-group-delete'
      ]}
      component={routeProps => (
        <Drawer {...routeProps} styleName={cx('drawer')} {...{ group }} />
      )}
    />
  )
}

const detailRoutes = [
  { path: `/:context(all|public)/:view(events|explore|map|projects|stream)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(all|public)/:view(map)/${GROUP_DETAIL_MATCH}`, component: GroupDetail },
  { path: `/:context(public)/:view(groups)/${GROUP_DETAIL_MATCH}`, component: GroupDetail },
  { path: `/:context(all)/:view(members)/:personId/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(all|public)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/:view(events|explore|map|projects|stream)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/:view(members)/:personId/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/:view(explore|map|groups)/${GROUP_DETAIL_MATCH}`, component: GroupDetail },
  { path: `/:context(groups)/:groupSlug/:view(topics)/:topicName/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/${GROUP_DETAIL_MATCH}`, component: GroupDetail },
  { path: `/:view(members)/:personId/${POST_DETAIL_MATCH}`, component: PostDetail }
]

// Redirects for legacy and NonAuth routes
const redirectRoutes = [
  { from: '/:context(public|all)/p/:postId', to: '/:context/post/:postId' },
  { from: '/:context(public|all)/project', to: '/:context/projects' },
  { from: '/:context(public|all)/event', to: '/:context/events' },
  { from: '/p/:postId', to: '/all/post/:postId' },
  { from: '/m/:personId', to: '/all/members/:personId' },
  { from: '/m/:personId/p/:postId', to: '/all/members/:personId/post/:postId' },
  { from: '/all/m/:personId', to: '/all/members/:personId' },
  { from: '/all/m/:personId/p/:postId', to: '/all/members/:personId/post/:postId' },
  { from: '/(c|n)/:groupSlug/join/:accessCode', to: '/groups/:groupSlug/join/:accessCode' },
  { from: '/(c|n)/:groupSlug/', to: '/groups/:groupSlug/' },
  { from: '/(c|n)/:groupSlug/event', to: '/groups/:groupSlug/events' },
  { from: '/(c|n)/:groupSlug/event/:postId', to: '/groups/:groupSlug/events/post/:postId' },
  { from: '/(c|n)/:groupSlug/project', to: '/groups/:groupSlug/projects' },
  { from: '/(c|n)/:groupSlug/project/:postId', to: '/groups/:groupSlug/projects/post/:postId' },
  { from: '/(c|n)/:groupSlug/:view(members|map|settings|topics)', to: '/groups/:groupSlug/:view' },
  { from: '/(c|n)/:groupSlug/map/p/:postId', to: '/groups/:groupSlug/map/post/:postId' },
  { from: '/(c|n)/:groupSlug/p/:postId', to: '/groups/:groupSlug/post/:postId' },
  { from: '/groups/:groupSlug/p/:postId', to: '/groups/:groupSlug/post/:postId' },
  { from: '/(c|n)/:groupSlug/m/:personId', to: '/groups/:groupSlug/members/:personId' },
  { from: '/(c|n)/:groupSlug/m/:personId/p/:postId', to: '/groups/:groupSlug/members/:personId/post/:postId' },
  { from: '/(c|n)/:groupSlug/:topicName', to: '/groups/:groupSlug/topics/:topicName' },
  { from: '/(c|n)/:groupSlug/:topicName/p/:postId', to: '/groups/:groupSlug/topics/:topicName/post/:postId' },
  // redirects for switching into global contexts, since these pages don't exist yet
  { from: '/all/(members|settings)', to: '/all' },
  { from: '/public/(members|topics|settings)', to: '/public' }
]
