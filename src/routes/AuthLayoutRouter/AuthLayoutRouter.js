import cx from 'classnames'
import { get, isEqual, some } from 'lodash/fp'
import qs from 'querystring'
import React, { Component } from 'react'
import Intercom from 'react-intercom'
import Joyride from 'react-joyride'
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
  REQUIRED_EDIT_POST_MATCH,
  isAboutPath,
  isWelcomePath,
  isMapViewPath
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
// import MemberSidebar from 'routes/MemberSidebar'
import Members from 'routes/Members'
import Messages from 'routes/Messages'
import Navigation from './components/Navigation'
import NotFound from 'components/NotFound'
import PostDetail from 'routes/PostDetail'
import Search from 'routes/Search'
import WelcomeWizard from 'routes/WelcomeWizard'
import SocketListener from 'components/SocketListener'
import SocketSubscriber from 'components/SocketSubscriber'
import TopNav from './components/TopNav'
import UserSettings from 'routes/UserSettings'
import './AuthLayoutRouter.scss'

// In order of more specific to less specific
const routesWithDrawer = [
  { path: `/:context(all|public)/:view(events|explore|map|projects|stream)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(public)/:view(group)/${OPTIONAL_GROUP_MATCH}` },
  { path: `/:context(all|public)/:view(map)/${OPTIONAL_GROUP_MATCH}` },
  { path: `/:context(all|public)/${OPTIONAL_POST_MATCH}` },
  { path: '/:context(all)/:view(topics)/:topicName' },
  { path: '/:context(all)/:view(topics)' },
  // Group Routes
  { path: `/:context(groups)/:groupSlug/:view(members)/:personId/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_GROUP_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(events|explore|groups|map|members|projects|settings|stream|topics)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/${OPTIONAL_POST_MATCH}` },
  // Member Routes
  { path: `/:view(members)/:personId/${OPTIONAL_POST_MATCH}` },
  // Other Routes
  { path: '/messages' },
  { path: '/settings' },
  { path: '/search' },
  { path: '/confirm-group-delete' }
]

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

const createRoutes = [
  { path: `/:context(all|public)/:view(events|explore|groups|map|projects|stream)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(all|public)/:view(members)/:personId?/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(all|public)/:views(topics)/:topicName/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(all|public)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(members)/:personId?/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(events|explore|groups|map|projects|stream|topics)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(groups|map)/${GROUP_DETAIL_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/${OPTIONAL_GROUP_MATCH}` },
  { path: `/:view(members)/:personId/${OPTIONAL_POST_MATCH}` }
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
  // redirects for context switching into global contexts, since these pages don't exist yet
  { from: '/all/(members|settings)', to: '/all' },
  { from: '/public/(members|topics|settings)', to: '/public' }
]

const tourSteps = desktopWidth => {
  const steps = [
    {
      disableBeacon: true,
      target: '#currentContext',
      title: desktopWidth ? 'You are here!' : 'Group menu',
      content: desktopWidth
        ? 'This is where we show you which group or other view you are looking at. Click here to return to the home page.'
        : 'Press on the group name or icon to navigate within the current group or view. Discover events, discussions, resources & more!'
    },
    {
      target: '#toggleDrawer',
      title: 'Switching groups & viewing all',
      content: 'This menu allows you to switch between groups, or see updates from all your groups at once.\n\nWant to see what else is out there? Navigate over to Public Groups & Posts to see!'
    }
  ]
  if (desktopWidth) {
    steps.push({
      target: '#groupMenu',
      title: 'Create & navigate',
      content: 'Here you can switch between types of content and create new content for people in your group or everyone on Hylo!',
      placement: 'right'
    })
  }
  return steps.concat({
    target: '#personalSettings',
    title: 'Messages, notifications & profile',
    content: 'Search for posts & people. Send messages to group members or people you see on Hylo. Stay up to date with current events and edit your profile.'
  })
}

export default class AuthLayoutRouter extends Component {
  static contextType = LayoutFlagsContext

  constructor (props) {
    super(props)

    this.state = {
      run: false,
      closeTheTour: false
    }
  }

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
    if (!isEqual(this.props.routeParams, prevProps.routeParams)) {
      this.scrollToTop()
    }
  }

  handleClickStartTour = (e) => {
    e.preventDefault()
    this.props.updateUserSettings({ settings: { alreadySeenTour: true } })
    this.setState({
      run: true,
      closeTheTour: true
    })
  }

  handleCloseTour = () => {
    this.props.updateUserSettings({ settings: { alreadySeenTour: true } })
    this.setState({
      closeTheTour: true
    })
  }

  handleCloseDrawer = () => this.props.isDrawerOpen && this.props.toggleDrawer()

  scrollToTop = () => {
    const centerColumn = document.getElementById(CENTER_COLUMN_ID)
    if (centerColumn) {
      centerColumn.scrollTop = 0
    }
  }

  tourSteps = () => {
    const desktopWidth = this.props.width > 600
    return tourSteps(desktopWidth)
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
      isGroupRoute,
      lastViewedGroup,
      location,
      returnToPath,
      setReturnToPath,
      routeParams,
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
      // Equatest ot blank center column when `signupInProgress`
      ? null
      : lastViewedGroup
        ? `/groups/${lastViewedGroup.slug}`
        : '/all'

    if (isGroupRoute) {
      if (!group && !groupPending) return <NotFound />
    }

    const { mobileSettingsLayout } = this.context
    const withoutNav = mobileSettingsLayout
    const queryParams = qs.parse(location.search.substring(1))
    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, { path }),
      detailRoutes
    )
    const isMapView = isMapViewPath(location.pathname)
    const collapsedState = hasDetail || (isMapView && queryParams.hideDrawer !== 'true')
    const isSingleColumn = (slug && !currentGroupMembership) || matchPath(location.pathname, { path: '/members/:personId' })
    const showTourPrompt = !signupInProgress &&
      !get('settings.alreadySeenTour', currentUser) &&
      !isSingleColumn && // Don't show tour on non-member group details page
      !get('settings.showJoinForm', currentGroupMembership) && // Show group welcome modal before tour
      !withoutNav

    return (
      <Div100vh styleName={cx('container', { 'map-view': isMapView, singleColumn: isSingleColumn, detailOpen: hasDetail })}>
        {/* Route-based Redirection */}
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

        {/* Site tour */}
        {showTourPrompt && (
          <Route
            path='/:context(all|public|groups)'
            component={props => (
              <div styleName={cx('tourWrapper', { tourClosed: this.state.closeTheTour })}>
                <div styleName='tourPrompt'>
                  <div styleName='tourGuide'><img src='/axolotl-tourguide.png' /></div>
                  <div styleName='tourExplanation'>
                    <p><strong>Welcome to Hylo {currentUser.name}!</strong> I’d love to show you how things work, would you like a quick tour?</p>
                    <p>To follow the tour look for the pulsing beacons! <span styleName='beaconExample'><span styleName='beaconA' /><span styleName='beaconB' /></span></p>
                    <div>
                      <button styleName='skipTour' onClick={this.handleCloseTour}>No thanks</button>
                      <button styleName='startTour' onClick={this.handleClickStartTour}>Show me Hylo</button>
                    </div>
                    <div styleName='speechIndicator' />
                  </div>
                </div>
                <div styleName='tourBg' onClick={this.handleCloseTour} />
              </div>
            )}
          />
        )}

        {/* Context navigation drawer */}
        {!withoutNav && (
          <>
            <Switch>
              {routesWithDrawer.map(({ path }) => (
                <Route
                  path={path}
                  key={path}
                  render={props => (
                    <Drawer {...props} styleName={cx('drawer', { hidden: !isDrawerOpen })} {...{ group }} />
                  )}
                />
              ))}
            </Switch>
            <TopNav styleName='top' onClick={this.handleCloseDrawer} {...{ group, currentUser, routeParams, showMenuBadge, width }} />
          </>
        )}

        <div styleName={cx('main', { 'map-view': isMapView, withoutNav })} onClick={this.handleCloseDrawer}>
          {/* View navigation menu */}
          <Route
            path='/:context(all|public)'
            component={props => (
              <Navigation
                {...props}
                collapsed={collapsedState}
                styleName={cx('left', { 'map-view': isMapView }, { hidden: !isGroupMenuOpen })}
                mapView={isMapView}
              />
            )}
          />
          {group && currentGroupMembership && (
            <Route
              path='/:context(groups)/:groupSlug'
              component={props => (
                <Navigation
                  {...props}
                  group={group}
                  collapsed={collapsedState}
                  styleName={cx('left', { 'map-view': isMapView }, { hidden: !isGroupMenuOpen })}
                  mapView={isMapView}
                />
              )}
            />
          )}
          {/* When joining a group by invitation show join form */}
          {currentGroupMembership && get('settings.showJoinForm', currentGroupMembership) && (
            <Route
              path='/:context(groups)/:groupSlug'
              render={props => (
                <GroupWelcomeModal {...props} group={group} />
              )}
            />
          )}
          <Div100vh styleName={cx('center', { 'map-view': isMapView, collapsedState, withoutNav })} id={CENTER_COLUMN_ID}>
            <Switch>
              <Route path='/welcome' component={WelcomeWizard} />
              {/* **** Member Routes **** */}
              <Route path={`/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} render={props => <MemberProfile {...props} isSingleColumn={isSingleColumn} />} />
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
                <Route
                  path='/:context(groups)/:groupSlug'
                  render={props => (
                    <GroupDetail {...props} group={group} />
                  )}
                />
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
              {/* Other Routes */}
              <Route path='/settings' component={UserSettings} />
              <Route path='/search' component={Search} />
              {/* Default Route (404) */}
              {defaultRedirectPath && (
                <Redirect to={defaultRedirectPath} />
              )}
            </Switch>
          </Div100vh>
          {(group && currentGroupMembership) && (
            <div styleName={cx('sidebar', { hidden: (hasDetail || isMapView) })}>
              <Switch>
                <Route path={`/:context(groups)/:groupSlug/:view(events|explore|map|groups|projects|stream)/${OPTIONAL_NEW_POST_MATCH}`} component={GroupSidebar} />
                <Route path={`/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_NEW_POST_MATCH}`} component={GroupSidebar} />
                <Route path={`/:context(groups)/:groupSlug/${OPTIONAL_NEW_POST_MATCH}`} component={GroupSidebar} />
              </Switch>
            </div>
          )}
          <div styleName={cx('detail', { hidden: !hasDetail })} id={DETAIL_COLUMN_ID}>
            <Switch>
              {detailRoutes.map(({ path, component }) => isAboutPath(location.pathname)
                ? <Route path={path} render={props => <GroupDetail {...props} communityId={group.id} />} key={path} />
                : <Route path={path} component={component} key={path} />
              )}
            </Switch>
          </div>
        </div>
        <Route path='/messages/:messageThreadId?' render={props => <Messages {...props} />} />
        <Switch>
          {createRoutes.map(({ path }) => (
            <Route
              path={path + '/create'}
              key={path + 'create'}
              children={({ match, location }) => (
                <CreateModal match={match} location={location} />
              )}
            />
          ))}
          {createRoutes.map(({ path }) => (
            <Route
              path={path + '/' + REQUIRED_EDIT_POST_MATCH}
              key={path + 'editpost'}
              children={({ match, location }) => (
                <CreateModal match={match} location={location} />
              )}
            />
          ))}
        </Switch>
        <SocketListener location={location} />
        <SocketSubscriber type='group' id={get('slug', group)} />
        <Intercom appID={isTest ? '' : config.intercom.appId} hide_default_launcher />
        <Joyride
          run={this.state.run}
          continuous
          showProgress
          showClose
          tooltipComponent={TourTooltip}
          steps={this.tourSteps()}
        />
      </Div100vh>
    )
  }
}

function TourTooltip ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps
}) {
  return (
    <div {...tooltipProps} styleName='tooltipWrapper'>
      <div styleName='tooltipContent'>
        <div styleName='tourGuide'><img src='/axolotl-tourguide.png' /></div>
        <div>
          {step.title && <div styleName='stepTitle'>{step.title}</div>}
          <div>{step.content}</div>
        </div>
      </div>
      <div styleName='tooltipControls'>
        {index > 0 && (
          <button styleName='backButton' {...backProps}>
            Back
          </button>
        )}
        {continuous && (
          <button styleName='nextButton' {...primaryProps}>
            Next
          </button>
        )}
        {!continuous && (
          <button {...closeProps}>
            Close
          </button>
        )}
      </div>
    </div>
  )
}
