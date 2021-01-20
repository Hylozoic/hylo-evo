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
// import AddSkills from 'routes/Signup/AddSkills'
import AllTopics from 'routes/AllTopics'
import CreateCommunity from 'routes/CreateCommunity'
import CommunityDetail from 'routes/CommunityDetail'
import CommunityDeleteConfirmation from 'routes/CommunitySettings/CommunityDeleteConfirmation'
import CommunityReview from 'routes/CreateCommunity/Review'
import CommunitySettings from 'routes/CommunitySettings'
import CommunitySidebar from 'routes/CommunitySidebar'
import Domain from 'routes/CreateCommunity/Domain'
import Drawer from './components/Drawer'
import Feed from 'routes/Feed'
import MapExplorer from 'routes/MapExplorer'
import Loading from 'components/Loading'
import MemberProfile from 'routes/MemberProfile'
// import MemberSidebar from 'routes/MemberSidebar'
import Members from 'routes/Members'
import Messages from 'routes/Messages'
import Navigation from './components/Navigation'
import Name from 'routes/CreateCommunity/Name'
import NetworkCommunities from 'routes/NetworkCommunities'
import NetworkSettings from 'routes/NetworkSettings'
import NetworkSidebar from 'routes/NetworkSidebar'
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
  OPTIONAL_POST_MATCH, OPTIONAL_COMMUNITY_MATCH,
  OPTIONAL_NEW_POST_MATCH, POST_DETAIL_MATCH, COMMUNITY_DETAIL_MATCH,
  REQUIRED_EDIT_POST_MATCH, REQUIRED_NEW_POST_MATCH,
  isSignupPath,
  isMapViewPath
} from 'util/navigation'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'
import './PrimaryLayout.scss'

export default class PrimaryLayout extends Component {
  componentDidMount () {
    this.props.fetchForCurrentUser()
    if (this.props.slug) {
      this.props.fetchForCommunity()
    }
  }

  componentDidUpdate (prevProps) {
    if (get('community.id', this.props) !== get('community.id', prevProps)) {
      this.props.fetchForCommunity()
    }
  }

  render () {
    const {
      community,
      network,
      currentUser,
      isDrawerOpen,
      location,
      toggleDrawer,
      isCommunityRoute,
      communityPending,
      showLogoBadge
    } = this.props

    if (!currentUser) {
      return <div styleName='container'>
        <Loading type='loading-fullscreen' />
      </div>
    }

    if (isCommunityRoute) {
      if (!community && !communityPending) return <NotFound />
    }

    const closeDrawer = () => isDrawerOpen && toggleDrawer()
    const queryParams = qs.parse(location.search.substring(1))
    const signupInProgress = get('settings.signupInProgress', currentUser)
    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, { path, exact: true }),
      detailRoutes
    )
    const routesWithNavigation = [
      { path: '/:context(all|public)' },
      { path: '/:context(n)/:networkSlug' },
      { path: '/:context(c)/:slug' }
    ]
    const routesWithDrawer = [
      { path: '/:context(all)/:view(topics)' },
      { path: `/:context(all|public)/:view(map)/${OPTIONAL_POST_MATCH}` },
      { path: `/:context(all|public)/:view(map)/${OPTIONAL_COMMUNITY_MATCH}` },
      { path: `/:context(all|public)/${OPTIONAL_POST_MATCH}` },
      { path: '/:context(all|public)/:topicName' },
      // {/* Network Routes */}
      { path: '/:context(n)/:networkSlug/:view(members|settings|communities|topics)' },
      { path: `/:context(n)/:networkSlug/:view(map)/${OPTIONAL_POST_MATCH}` },
      { path: `/:context(n)/:networkSlug/m/:personId/${OPTIONAL_POST_MATCH}` },
      { path: `/:context(n)/:networkSlug/${OPTIONAL_POST_MATCH}` },
      { path: `/:context(n)/:networkSlug/:topicName/${OPTIONAL_POST_MATCH}` },
      // {/* Community Routes */}
      { path: '/:context(c)/:slug/:view(members|settings|topics)' },
      { path: `/:context(c)/:slug/:view(map)/${OPTIONAL_POST_MATCH}` },
      { path: `/:context(c)/:slug/m/:personId/${OPTIONAL_POST_MATCH}` },
      { path: `/:context(c)/:slug/${OPTIONAL_POST_MATCH}` },
      { path: `/:context(c)/:slug/:topicName/${OPTIONAL_POST_MATCH}` },
      // {/* Member Routes */}
      { path: `/:context(m)/:personId/${OPTIONAL_POST_MATCH}` },
      // {/* Other Routes */}
      { path: '/settings' },
      { path: '/search' },
      { path: '/confirm-community-delete' }
    ]
    const collapsedState = hasDetail || (isMapViewPath(location.pathname) && queryParams['hideDrawer'] !== 'true')

    return <div styleName={cx('container', { 'map-view': isMapViewPath(location.pathname) })}>
      <Switch>
        {routesWithDrawer.map(({ path }) => (
          <Route path={path} key={path} render={props => (
            <Drawer {...props} styleName={cx('drawer', { hidden: !isDrawerOpen })} {...{ community, network }} />
          )} />
        ))}
      </Switch>
      <TopNav styleName='top' onClick={closeDrawer} {...{ community, network, currentUser, showLogoBadge }} />
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
            {createCommunityRoutes.map(({ path, component }) =>
              <Route path={path} key={path} render={props =>
                <CreateCommunity {...props} component={component} />} />)}
            {signupInProgress &&
              <RedirectToSignupFlow pathname={this.props.location.pathname} currentUser={currentUser} />}
            {!signupInProgress &&
              <RedirectToCommunity path='/(|app)' currentUser={currentUser} />}
            {/* All and Public Routes */}
            <Route path='/:context(all)/:view(topics)' component={AllTopics} />
            <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_POST_MATCH}`} exact component={MapExplorer} />
            <Route path={`/:context(all|public)/:view(map)/${OPTIONAL_COMMUNITY_MATCH}`} exact component={MapExplorer} />
            <Route path={`/:context(all|public)/${OPTIONAL_POST_MATCH}`} exact component={Feed} />
            <Route path='/:context(all|public)/:topicName' exact component={Feed} />
            {/* Network Routes */}
            <Route path='/:context(n)/:networkSlug/:view(communities)' component={NetworkCommunities} />
            <Route path='/:context(n)/:networkSlug/:view(topics)' component={AllTopics} />
            <Route path={`/:context(n)/:networkSlug/:view(map)/${OPTIONAL_POST_MATCH}`} exact component={MapExplorer} />
            <Route path='/:context(n)/:networkSlug/:view(members)' component={Members} />
            <Route path='/:context(n)/:networkSlug/:view(settings)' component={NetworkSettings} />
            <Route path={`/:context(n)/:networkSlug/m/:personId/${OPTIONAL_POST_MATCH}`} exact component={MemberProfile} />
            <Route path={`/:context(n)/:networkSlug/${OPTIONAL_POST_MATCH}`} exact component={Feed} />
            <Route path={`/:context(n)/:networkSlug/:topicName/${OPTIONAL_POST_MATCH}`} exact component={Feed} />
            {/* Community Routes */}
            <Route path='/:context(c)/:slug/:view(topics)' component={AllTopics} />
            <Route path={`/:context(c)/:slug/:view(map)/${OPTIONAL_POST_MATCH}`} exact component={MapExplorer} />
            <Route path='/:context(c)/:slug/:view(members)' component={Members} />
            <Route path='/:context(c)/:slug/:view(settings)' component={CommunitySettings} />
            <Route path={`/:context(c)/:slug/m/:personId/${OPTIONAL_POST_MATCH}`} exact component={MemberProfile} />
            <Route path={`/:context(c)/:slug/${OPTIONAL_POST_MATCH}`} exact component={Feed} />
            <Route path={`/:context(c)/:slug/:topicName/${OPTIONAL_POST_MATCH}`} component={Feed} />
            {/* Member Routes */}
            <Route path={`/:context(m)/:personId/${OPTIONAL_POST_MATCH}`} exact component={MemberProfile} />
            {/* Other Routes */}
            <Route path='/settings' component={UserSettings} />
            <Route path='/search' component={Search} />
            <Route path='/confirm-community-delete' component={CommunityDeleteConfirmation} />
          </Switch>
        </div>
        <div styleName={cx('sidebar', { hidden: (hasDetail || isMapViewPath(location.pathname)) })}>
          <Switch>
            <Route path={`/:context(c)/:slug${OPTIONAL_NEW_POST_MATCH}`} exact component={CommunitySidebar} />
            {/* LEJ: Leaving MemberSidebar vestiage here for now as new sidebar content is likely coming soon */}
            {/* <Route path={`/:context(c)/:slug/m/:personId/${OPTIONAL_NEW_POST_MATCH}`} component={MemberSidebar} /> */}
            <Route path={`/:context(c)/:slug/:topicName/${OPTIONAL_NEW_POST_MATCH}`} exact component={CommunitySidebar} />
            <Route path={`/:context(n)/:networkSlug/${OPTIONAL_NEW_POST_MATCH}`} exact component={NetworkSidebar} />
            {/* <Route path={`/:context(n)/:networkSlug/m/:personId/${OPTIONAL_NEW_POST_MATCH}`} exact component={MemberSidebar} /> */}
            {/* <Route path={`/:context(m)/:personId/${OPTIONAL_NEW_POST_MATCH}`} exact component={MemberSidebar} /> */}
          </Switch>
        </div>
        <div styleName={cx('detail', { hidden: !hasDetail })} id={DETAIL_COLUMN_ID}>
          <Switch>
            {detailRoutes.map(({ path, component }) =>
              <Route path={path} component={component} key={path} />)}
          </Switch>
        </div>
      </div>
      <Route path='/t/:messageThreadId?' render={props => <Messages {...props} />} />
      <Switch>
        {postEditorRoutes.map(({ path }) =>
          <Route path={path} exact key={path} children={({ match, location }) =>
            <PostEditorModal match={match} location={location} />} />)}
      </Switch>
      <SocketListener location={location} />
      <SocketSubscriber type='community' id={get('slug', community)} />
      <Intercom appID={isTest ? null : config.intercom.appId} hide_default_launcher />
    </div>
  }
}

const detailRoutes = [
  { path: `/:context(all|public)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(all|public)/:view(map)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(all|public)/:view(map)/${COMMUNITY_DETAIL_MATCH}`, component: CommunityDetail },
  { path: `/:context(n)/:networkSlug/m/:personId/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(n)/:networkSlug/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(n)/:networkSlug/:view(map)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(n)/:networkSlug/:topicName/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(c)/:slug/m/:personId/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(c)/:slug/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(c)/:slug/:view(map)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(c)/:slug/:topicName/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(m)/:personId/${POST_DETAIL_MATCH}`, component: PostDetail }
]

const postEditorRoutes = [
  { path: `/:context(all|public)/${REQUIRED_NEW_POST_MATCH}` },
  { path: `/:context(all|public)/${REQUIRED_EDIT_POST_MATCH}` },
  { path: `/:context(all|public)/:topicName/${REQUIRED_NEW_POST_MATCH}` },
  { path: `/:context(all|public)/:topicName/${REQUIRED_EDIT_POST_MATCH}` },
  { path: `/:context(n)/:networkSlug/${REQUIRED_NEW_POST_MATCH}` },
  { path: `/:context(n)/:networkSlug/${REQUIRED_EDIT_POST_MATCH}` },
  { path: `/:context(n)/:networkSlug/m/:personId/${REQUIRED_EDIT_POST_MATCH}` },
  { path: `/:context(n)/:networkSlug/:topicName/${REQUIRED_NEW_POST_MATCH}` },
  { path: `/:context(n)/:networkSlug/:topicName/${REQUIRED_EDIT_POST_MATCH}` },
  { path: `/:context(c)/:slug/${REQUIRED_NEW_POST_MATCH}` },
  { path: `/:context(c)/:slug/${REQUIRED_EDIT_POST_MATCH}` },
  { path: `/:context(c)/:slug/m/:personId/${REQUIRED_EDIT_POST_MATCH}` },
  { path: `/:context(c)/:slug/:topicName/${REQUIRED_NEW_POST_MATCH}` },
  { path: `/:context(c)/:slug/:topicName/${REQUIRED_EDIT_POST_MATCH}` },
  { path: `/:context(m)/:personId/${REQUIRED_EDIT_POST_MATCH}` }
]

const signupRoutes = [
  { path: '/signup/upload-photo', child: UploadPhoto },
  { path: '/signup/add-location', child: AddLocation },
  // { path: '/signup/add-skills', child: AddSkills },
  { path: '/signup/review', child: Review }
]

const createCommunityRoutes = [
  { path: '/create-community/name/:networkId', component: Name },
  { path: '/create-community/name', component: Name },
  { path: '/create-community/domain', component: Domain },
  { path: '/create-community/review', component: CommunityReview }
]

const redirectRoutes = [
  { from: '/tag/:topicName', to: '/all/:topicName' },
  { from: '/c/:slug/tag/:topicName', to: '/c/:slug/:topicName' },
  { from: '/c/:slug/join/:accessCode/tag/:topicName', to: '/c/:slug/join/:accessCode/:topicName' },
  { from: '/p/:postId', to: '/all/p/:postId' },
  { from: '/u/:personId', to: '/m/:personId' },
  { from: '/c/:slug/about', to: '/c/:slug' },
  { from: '/c/:slug/people', to: '/c/:slug/:view(members)' },
  { from: '/c/:slug/invite', to: '/c/:slug/:view(settings)/invite' },
  { from: '/c/:slug/events', to: '/c/:slug' },
  // redirects for context switching into global contexts
  { from: '/all/members', to: '/all' },
  { from: '/public/(members|topics)', to: '/public' }
]

export function RedirectToSignupFlow ({ pathname }) {
  if (isSignupPath(pathname)) return null

  return <Redirect to='/signup/upload-photo' />
}

export function RedirectToCommunity ({ path, currentUser }) {
  let redirectToPath = '/all'

  if (currentUser.memberships.count() > 0) {
    const mostRecentCommunity = currentUser.memberships
      .orderBy(m => new Date(m.lastViewedAt), 'desc')
      .first()
      .community
    redirectToPath = `/c/${mostRecentCommunity.slug}`
  }

  return <Redirect exact from={path} to={redirectToPath} />
}
