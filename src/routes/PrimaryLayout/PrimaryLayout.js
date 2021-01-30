import React, { Component } from 'react'
import {
  matchPath,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import cx from 'classnames'
import { get, some } from 'lodash/fp'
import qs from 'querystring'
import Intercom from 'react-intercom'
import config, { isTest } from 'config'
import AddLocation from 'routes/Signup/AddLocation'
import AddSkills from 'routes/Signup/AddSkills'
import AllTopics from 'routes/AllTopics'
import CreateGroup from 'components/CreateGroup'
import CreateModal from 'components/CreateModal'
import GroupDetail from 'routes/GroupDetail'
import GroupDeleteConfirmation from 'routes/GroupSettings/GroupDeleteConfirmation'
import GroupSettings from 'routes/GroupSettings'
import GroupSidebar from 'routes/GroupSidebar'
import Groups from 'routes/Groups'
import Drawer from './components/Drawer'
import Feed from 'routes/Feed'
import MapExplorer from 'routes/MapExplorer'
import Loading from 'components/Loading'
import MemberProfile from 'routes/MemberProfile'
// import MemberSidebar from 'routes/MemberSidebar'
import Members from 'routes/Members'
import Messages from 'routes/Messages'
import Navigation from './components/Navigation'
import NotFound from 'components/NotFound'
import PostDetail from 'routes/PostDetail'
import PostEditorModal from 'components/PostEditorModal'
import Review from 'routes/Signup/Review'
import Search from 'routes/Search'
import SignupModal from 'routes/Signup/SignupModal'
import SocketListener from 'components/SocketListener'
import SocketSubscriber from 'components/SocketSubscriber'
import TopNav from './components/TopNav'
import UploadPhoto from 'routes/Signup/UploadPhoto'
import UserSettings from 'routes/UserSettings'
import {
  OPTIONAL_POST_MATCH, OPTIONAL_GROUP_MATCH,
  OPTIONAL_NEW_POST_MATCH, POST_DETAIL_MATCH, GROUP_DETAIL_MATCH,
  REQUIRED_EDIT_POST_MATCH, REQUIRED_NEW_POST_MATCH, REQUIRED_NEW_GROUP_MATCH,
  isSignupPath,
  isMapViewPath
} from 'util/navigation'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'
import './PrimaryLayout.scss'

const routesWithNavigation = [
  { path: '/:context(all|public)' },
  { path: '/:context(groups)/:groupSlug' }
]

// In order of more specific to less specific
const routesWithDrawer = [
  { path: `/:context(all|public)/:view(events|map|projects)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(all|public)/:view(map)/${OPTIONAL_GROUP_MATCH}` },
  { path: `/:context(all|public)/${OPTIONAL_POST_MATCH}` },
  { path: '/:context(all)/:view(topics)/:topicName' },
  { path: '/:context(all)/:view(topics)' },
  // {/* Group Routes */}
  { path: `/:context(groups)/:groupSlug/:view(members)/:personId/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_GROUP_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(events|groups|map|members|projects|settings|topics)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/${OPTIONAL_POST_MATCH}` },
  // {/* Member Routes */}
  { path: `/:view(members)/:personId/${OPTIONAL_POST_MATCH}` },
  // {/* Other Routes */}
  { path: '/settings' },
  { path: '/search' },
  { path: '/confirm-group-delete' }
]

const detailRoutes = [
  { path: `/:context(all|public)/:view(events|map|projects)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(all|public)/:view(map)/${GROUP_DETAIL_MATCH}`, component: GroupDetail },
  { path: `/:context(all|public)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/:view(map|events|projects)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/:view(members)/:personId/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/:view(map)/${GROUP_DETAIL_MATCH}`, component: GroupDetail },
  { path: `/:context(groups)/:groupSlug/:view(topics)/:topicName/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(groups)/:groupSlug/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:view(members)/:personId/${POST_DETAIL_MATCH}`, component: PostDetail }
]

const createRoutes = [
  { path: `/:context(all|public)/:view(events|groups|map|projects)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(all|public)/:views(topics)/:topicName/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(all|public)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(members)/:personId/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(projects|events|groups|map|topics)/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}` },
  { path: `/:context(groups)/:groupSlug/${OPTIONAL_POST_MATCH}` },
  { path: `/:view(members)/:personId/${OPTIONAL_POST_MATCH}` }
]

const signupRoutes = [
  { path: '/signup/upload-photo', child: UploadPhoto },
  { path: '/signup/add-location', child: AddLocation },
  { path: '/signup/add-skills', child: AddSkills },
  { path: '/signup/review', child: Review }
]

const redirectRoutes = [
  { from: '/tag/:topicName', to: '/all/topics/:topicName' },
  { from: '/c/:groupSlug/', to: '/groups/:groupSlug/' },
  { from: '/n/:groupSlug/', to: '/groups/:groupSlug/' },
  { from: '/c/:groupSlug/tag/:topicName', to: '/groups/:groupSlug/topics/:topicName' },
  // TODO: is this right?
  { from: '/c/:groupSlug/join/:accessCode/tag/:topicName', to: '/groups/:groupSlug/join/:accessCode/topics/:topicName' },
  { from: '/p/:postId', to: '/all/post/:postId' },
  { from: '/u/:personId', to: '/members/:personId' },
  { from: '/c/:groupSlug/about', to: '/groups/:groupSlug' },
  { from: '/c/:groupSlug/people', to: '/groups/:groupSlug/members' },
  { from: '/c/:groupSlug/invite', to: '/groups/:groupSlug/settings/invite' },
  { from: '/c/:groupSlug/events', to: '/groups/:groupSlug/events' },
  // redirects for context switching into global contexts
  { from: '/all/members', to: '/all' },
  { from: '/public/(members|topics)', to: '/public' }
]

export default class PrimaryLayout extends Component {
  componentDidMount () {
    this.props.fetchForCurrentUser()
    if (this.props.slug) {
      this.props.fetchForGroup()
    }
  }

  componentDidUpdate (prevProps) {
    if (get('group.id', this.props) !== get('group.id', prevProps)) {
      this.props.fetchForGroup()
    }
  }

  render () {
    const {
      group,
      currentUser,
      isDrawerOpen,
      location,
      toggleDrawer,
      isGroupRoute,
      groupPending,
      showLogoBadge
    } = this.props

    if (!currentUser) {
      return <div styleName='container'>
        <Loading type='loading-fullscreen' />
      </div>
    }

    if (isGroupRoute) {
      if (!group && !groupPending) return <NotFound />
    }

    const closeDrawer = () => isDrawerOpen && toggleDrawer()
    const queryParams = qs.parse(location.search.substring(1))
    const signupInProgress = get('settings.signupInProgress', currentUser)
    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, { path }),
      detailRoutes
    )
    const collapsedState = hasDetail || (isMapViewPath(location.pathname) && queryParams['hideDrawer'] !== 'true')

    return <div styleName={cx('container', { 'map-view': isMapViewPath(location.pathname) })}>
      <Switch>
        {routesWithDrawer.map(({ path }) => (
          <Route path={path} key={path} render={props => (
            <Drawer {...props} styleName={cx('drawer', { hidden: !isDrawerOpen })} {...{ group }} />
          )} />
        ))}
      </Switch>
      <TopNav styleName='top' onClick={closeDrawer} {...{ group, currentUser, showLogoBadge }} />
      <div styleName={cx('main', { 'map-view': isMapViewPath(location.pathname) })} onClick={closeDrawer}>
        {routesWithNavigation.map(({ path }) =>
          <Route path={path} key={path} component={props =>
            <Navigation {...props}
              collapsed={collapsedState}
              styleName={cx('left', { 'map-view': isMapViewPath(location.pathname) })}
              mapView={isMapViewPath(location.pathname)}
            />}
          />
        )}
        <div styleName={cx('center', { 'map-view': isMapViewPath(location.pathname) }, { collapsedState })} id={CENTER_COLUMN_ID}>
          <Switch>
            {redirectRoutes.map(({ from, to }) => <Redirect from={from} to={to} exact key={from} />)}
            {signupRoutes.map(({ path, child }) =>
              <Route path={path} key={path} render={props =>
                <SignupModal {...props} child={child} />} />)}
            {signupInProgress &&
              <RedirectToSignupFlow pathname={this.props.location.pathname} currentUser={currentUser} />}
            {!signupInProgress &&
              <RedirectToGroup path='/(|app)' currentUser={currentUser} />}
            {/* All and Public Routes */}
            <Route path={`/:context(all|public)/:view(events|projects)/${OPTIONAL_POST_MATCH}`} component={Feed} />
            <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_POST_MATCH}`} component={MapExplorer} />
            <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_GROUP_MATCH}`} component={MapExplorer} />
            <Route path='/:context(all|public)/:view(topics)/:topicName' component={Feed} />
            <Route path='/:context(all)/:view(topics)' component={AllTopics} />
            <Route path={`/:context(all|public)/${OPTIONAL_POST_MATCH}`} component={Feed} />
            {/* Group Routes */}
            <Route path={`/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_POST_MATCH}`} component={MapExplorer} />
            <Route path={`/:context(groups)/:groupSlug/:view(map)/${OPTIONAL_GROUP_MATCH}`} component={MapExplorer} />
            <Route path={`/:context(groups)/:groupSlug/:view(events|projects)/${OPTIONAL_POST_MATCH}`} component={Feed} />
            <Route path='/:context(groups)/:groupSlug/:view(groups)' component={Groups} />
            <Route path={`/:context(groups)/:groupSlug/:view(members)/:personId/${OPTIONAL_POST_MATCH}`} component={MemberProfile} />
            <Route path='/:context(groups)/:groupSlug/:view(members)' component={Members} />
            <Route path={`/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_POST_MATCH}`} component={Feed} />
            <Route path='/:context(groups)/:groupSlug/:view(topics)' component={AllTopics} />
            <Route path='/:context(groups)/:groupSlug/:view(settings)' component={GroupSettings} />
            <Route path={`/:context(groups)/:groupSlug/${OPTIONAL_POST_MATCH}`} component={Feed} />
            {/* Member Routes */}
            <Route path={`/:context(members)/:personId/${OPTIONAL_POST_MATCH}`} component={MemberProfile} />
            {/* Other Routes */}
            <Route path='/settings' component={UserSettings} />
            <Route path='/search' component={Search} />
            <Route path='/confirm-group-delete' component={GroupDeleteConfirmation} />
          </Switch>
        </div>
        <div styleName={cx('sidebar', { hidden: (hasDetail || isMapViewPath(location.pathname)) })}>
          <Switch>
            <Route path={`/:context(groups)/:groupSlug/:view(events|map|groups|projects)/${OPTIONAL_NEW_POST_MATCH}`} component={GroupSidebar} />
            <Route path={`/:context(groups)/:groupSlug/:view(topics)/:topicName/${OPTIONAL_NEW_POST_MATCH}`} component={GroupSidebar} />
            <Route path={`/:context(groups)/:groupSlug/${OPTIONAL_NEW_POST_MATCH}`} component={GroupSidebar} />
          </Switch>
        </div>
        <div styleName={cx('detail', { hidden: !hasDetail })} id={DETAIL_COLUMN_ID}>
          <Switch>
            {detailRoutes.map(({ path, component }) =>
              <Route path={path} component={component} key={path} />)}
          </Switch>
        </div>
      </div>
      <Route path='/messages/:messageThreadId?' render={props => <Messages {...props} />} />
      <Switch>
        {createRoutes.map(({ path }) =>
          <Route path={path + '/create'} key={path + 'create'} children={({ match, location }) =>
            <CreateModal match={match} location={location} />} />)}
        {createRoutes.map(({ path }) =>
          <Route path={path + '/' + REQUIRED_NEW_GROUP_MATCH} key={path + 'newgroup'} children={({ match, location }) =>
            <CreateGroup match={match} location={location} />} />)}
        {createRoutes.map(({ path }) =>
          <Route path={path + '/' + REQUIRED_NEW_POST_MATCH} key={path + 'newpost'} children={({ match, location }) =>
            <PostEditorModal match={match} location={location} />} />)}
        {createRoutes.map(({ path }) =>
          <Route path={path + '/' + REQUIRED_EDIT_POST_MATCH} key={path + 'editpost'} children={({ match, location }) =>
            <PostEditorModal match={match} location={location} />} />)}
      </Switch>
      <SocketListener location={location} />
      <SocketSubscriber type='group' id={get('slug', group)} />
      <Intercom appID={isTest ? null : config.intercom.appId} hide_default_launcher />
    </div>
  }
}

export function RedirectToSignupFlow ({ pathname }) {
  if (isSignupPath(pathname)) return null

  return <Redirect to='/signup/upload-photo' />
}

export function RedirectToGroup ({ path, currentUser }) {
  let redirectToPath = '/all'

  if (currentUser.memberships.count() > 0) {
    const mostRecentGroup = currentUser.memberships
      .orderBy(m => new Date(m.lastViewedAt), 'desc')
      .first()
      .group
    redirectToPath = `/groups/${mostRecentGroup.slug}`
  }

  return <Redirect exact from={path} to={redirectToPath} />
}
