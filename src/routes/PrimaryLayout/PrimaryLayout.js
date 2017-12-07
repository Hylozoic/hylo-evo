import React, { PropTypes, Component } from 'react'
import { matchPath, Redirect, Route, Switch } from 'react-router-dom'
import cx from 'classnames'
import { get, some } from 'lodash/fp'

import AddLocation from 'routes/Signup/AddLocation'
import AddSkills from 'routes/Signup/AddSkills'
import AllTopics from 'routes/AllTopics'
import CreateCommunity from 'routes/CreateCommunity'
import CommunityReview from 'routes/CreateCommunity/Review'
import CommunitySettings from 'routes/CommunitySettings'
import CommunitySidebar from 'routes/CommunitySidebar'
import Domain from 'routes/CreateCommunity/Domain'
import Drawer from './components/Drawer'
import Feed from 'routes/Feed'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'
import Loading from 'components/Loading'
import MemberProfile from 'routes/MemberProfile'
import MemberSidebar from 'routes/MemberSidebar'
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
import TopicSupportComingSoon from 'components/TopicSupportComingSoon'
import TopNav from './components/TopNav'
import UploadPhoto from 'routes/Signup/UploadPhoto'
import UserSettings from 'routes/UserSettings'

// TODO: Implement create community privacy component when implemented on the server
// import Privacy from 'routes/CreateCommunity/Privacy'

import './PrimaryLayout.scss'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'
import mobileRedirect from 'util/mobileRedirect'

export const POST_ID_MATCH_REGEX = '\\d+'

export default class PrimaryLayout extends Component {
  static propTypes = {
    community: PropTypes.object,
    currentUser: PropTypes.object,
    location: PropTypes.object,
    isDrawerOpen: PropTypes.bool,
    toggleDrawer: PropTypes.func
  }

  componentDidMount () {
    // avoid fetching topics for All Communities if we're just going to redirect
    // to a single community
    const skipTopics = this.props.location.pathname !== '/all'
    this.props.fetchForCurrentUser(skipTopics)
  }

  componentDidUpdate (prevProps) {
    if (get('community.id', this.props) !== get('community.id', prevProps)) {
      this.props.fetchForCommunity()
    }
  }

  communityExists () {
    const {
      isCommunityRoute,
      community,
      currentUser,
      communityPending
    } = this.props

    if (isCommunityRoute && !community && currentUser && !communityPending) {
      return false
    }
    return true
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
      showLogoBadge,
      hasMemberships,
      returnToURL
    } = this.props

    if (isCommunityRoute && !currentUser) {
      return <Loading />
    }

    if (!this.communityExists()) {
      return <NotFound />
    }

    const closeDrawer = () => isDrawerOpen && toggleDrawer()
    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, {path}),
      detailRoutes
    )

    const showTopics = !isAllCommunitiesPath(location.pathname) && !isNetworkPath(location.pathname) && !isTagPath(location.pathname)

    // TODO move FullPageModals
    return <div styleName='container'>
      <Drawer community={community} network={network}
        styleName={cx('drawer', {hidden: !isDrawerOpen})} />
      <TopNav {...{community, network, currentUser, showLogoBadge}}
        styleName='top'
        onClick={closeDrawer} />
      <div styleName='main' onClick={closeDrawer}>
        <Navigation collapsed={hasDetail} styleName='left' showTopics={showTopics} />
        <div styleName='center' id={CENTER_COLUMN_ID}>
          <RedirectToSignupFlow currentUser={currentUser}
            pathname={this.props.location.pathname} />
          <RedirectToCreateCommunityFlow
            hasMemberships={hasMemberships}
            pathname={this.props.location.pathname}
            currentUser={currentUser}
            returnToURL={returnToURL}
          />
          <RedirectToCommunity path='/' currentUser={currentUser} />
          <RedirectToCommunity path='/app' currentUser={currentUser} />
          <Switch>
            {/* Redirect from->to with params doesn't work as expected, so I had to do this
            'hack'. from https://stackoverflow.com/a/46064986/2141561 */}
            <Route
              exact
              path='/c/:slug/tag/:topicName'
              render={props => (
                <Redirect to={`/c/${props.match.params.slug}/${props.match.params.topicName}`} />
                )}
            />
            <Route
              exact
              path='/c/:slug/join/:accessCode/tag/:topicName'
              render={props => (
                <Redirect to={`/c/${props.match.params.slug}/join/${props.match.params.accessCode}/${props.match.params.topicName}`} />
              )}
            />
            <Route
              exact
              path='/p/:postId'
              render={props => (
                <Redirect to={`/all/p/${props.match.params.postId}`} />
              )}
            />
            <Route
              exact
              path='/u/:id'
              render={props => (
                <Redirect to={`/m/${props.match.params.id}`} />
              )}
            />
            <Route
              exact
              path='/c/:slug/about'
              render={props => (
                <Redirect to={`/c/${props.match.params.slug}`} />
              )}
            />
            <Route
              exact
              path='/c/:slug/people'
              render={props => (
                <Redirect to={`/c/${props.match.params.slug}/members`} />
              )}
            />
            <Route
              exact
              path='/c/:slug/invite'
              render={props => (
                <Redirect to={`/c/${props.match.params.slug}/settings/invite`} />
              )}
            />

            {/* TODO this route should probably redirect to the communities events page when it's implemented (or remove this if the URLS are the same) */}
            <Route
              exact
              path='/c/:slug/events'
              render={props => (
                <Redirect to={`/c/${props.match.params.slug}`} />
              )}
            />

            {/* TODO this route should probably redirect to the communities projects page when it's implemented (or remove this if the URLS are the same) */}
            <Route
              exact
              path='/c/:slug/projects'
              render={props => (
                <Redirect to={`/c/${props.match.params.slug}`} />
              )}
            />
            <Route path='/tag/:topicName' exact component={TopicSupportComingSoon} />
            <Route path='/all' exact component={Feed} />
            <Route path='/all/:topicName' exact component={TopicSupportComingSoon} />
            <Route path='/all/p/:postId' component={Feed} />
            <Route path='/c/:slug' exact component={Feed} />
            <Route path='/c/:slug/members' component={Members} />
            <Route path='/c/:slug/m/:id' component={MemberProfile} />
            <Route path='/m/:id' component={MemberProfile} />
            <Route path='/c/:slug/p/:postId' component={Feed} />
            <Route path='/c/:slug/topics' component={AllTopics} />
            <Route path='/c/:slug/settings' component={CommunitySettings} />
            <Route path='/c/:slug/:topicName/p/:postId' component={Feed} />
            <Route path='/c/:slug/:topicName' component={Feed} />
            <Route path='/n/:networkSlug' exact component={Feed} />
            <Route path='/n/:networkSlug/p/:postId' component={Feed} />
            <Route path='/n/:networkSlug/members' component={Members} />
            <Route path='/n/:networkSlug/m/:id' component={MemberProfile} />
            <Route path='/n/:networkSlug/settings' component={NetworkSettings} />
            <Route path='/n/:networkSlug/communities' component={NetworkCommunities} />
            <Route path='/n/:networkSlug/:topicName' exact component={TopicSupportComingSoon} />

            <Route path='/events' component={Events} />
            <Route path='/settings' component={UserSettings} />
            <Route path='/search' component={Search} />
            {signupRoutes.map(({ path, child }) =>
              <Route
                path={path}
                key={path}
                component={(props) => <SignupModal {...props} child={child} />}
              />
            )}
            {createCommunityRoutes.map(({ path, component }) =>
              <Route
                path={path}
                key={path}
                component={(props) => <CreateCommunity {...props} component={component} />}
                />
            )}
          </Switch>
        </div>
        <div styleName={cx('sidebar', {hidden: hasDetail})}>
          <Route path='/c/:slug/p/new' exact component={CommunitySidebar} />
          <Route path='/c/:slug' exact component={CommunitySidebar} />
          <Route path='/c/:slug/:topicName/p/new' exact component={CommunitySidebar} />
          <Route path='/c/:slug/:topicName' exact component={CommunitySidebar} />
          <Route path='/c/:slug/m/:id' component={MemberSidebar} />
          <Route path='/n/:slug/m/:id' component={MemberSidebar} />
          <Route path='/m/:id' component={MemberSidebar} />
          <Route path='/n/:slug' exact component={NetworkSidebar} />
        </div>
        <div styleName={cx('detail', {hidden: !hasDetail})} id={DETAIL_COLUMN_ID}>
          {/*
            TODO: Display content of last detail page on '/' so that the
            animation transitions correctly.
            Best guess is to replace these routes with a render function
            defined above, and store the previous detail component in state
          */}
          {detailRoutes.map(({ path, component }) =>
            <Route key={path} {...{path, component}} />)}
        </div>
      </div>
      <Route path='/t' component={Messages} />
      <SocketListener location={location} />
      <SocketSubscriber type='community' id={get('slug', community)} />
      {postEditorRoutes.map(({path, forNew}) =>
        <Route
          key={path}
          path={path}
          exact
          children={({match}) => {
            return <PostEditorModal match={match} forNew={forNew} />
          }} />)}
    </div>
  }
}

const postEditorRoutes = [
  {path: '/all/p/new', forNew: true},
  {path: '/c/:slug/p/new', forNew: true},
  {path: '/all/p/:postId/edit'},
  {path: '/c/:slug/p/:postId/edit'},
  {path: '/c/:slug/m/:id/p/:postId/edit'},
  {path: '/c/:slug/:topicName/p/:postId/edit'},
  {path: '/n/:slug/m/:id/p/:postId/edit'}
]

const detailRoutes = [
  {path: '/events/:eventId', component: EventDetail},
  {path: `/all/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail},
  {path: `/c/:slug/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail},
  {path: `/n/:networkSlug/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail},
  {path: `/c/:slug/m/:id/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail},
  {path: `/c/:slug/:topicName/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail},
  {path: `/n/:slug/m/:id/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail}
]

const signupRoutes = [
  {path: '/signup/upload-photo', child: UploadPhoto},
  {path: '/signup/add-location', child: AddLocation},
  {path: '/signup/add-skills', child: AddSkills},
  {path: '/signup/review', child: Review}
]
const createCommunityRoutes = [
  {path: '/create-community/name', component: Name},
  {path: '/create-community/domain', component: Domain},
  // TODO: Implement create community privacy component when implemented on the server
  // TODO: Don't forget to change 'step' values
  // {path: '/create-community/privacy', component: Privacy},
  {path: '/create-community/review', component: CommunityReview}
]

export function isSignupPath (path) {
  return (path.startsWith('/signup'))
}

export function isCreateCommunityPath (path) {
  return (path.startsWith('/create-community'))
}

export function isJoinCommunityPath (path) {
  return (path.startsWith('/h/use-invitation'))
}

export function isAllCommunitiesPath (path) {
  return (path.startsWith('/all'))
}

export function isNetworkPath (path) {
  return (path.startsWith('/n/'))
}

export function isTagPath (path) {
  return (path.startsWith('/tag/'))
}

export function RedirectToSignupFlow ({ currentUser, pathname }) {
  if (!currentUser || !currentUser.settings || !currentUser.settings.signupInProgress) return null
  if (isSignupPath(pathname)) return null
  const destination = '/signup/upload-photo'
  return <Redirect to={destination} />
}

export function RedirectToCreateCommunityFlow ({ hasMemberships, pathname, returnToURL, currentUser }) {
  if (returnToURL && isJoinCommunityPath(returnToURL)) return null
  if (!currentUser || !currentUser.settings || currentUser.settings.signupInProgress) return null
  if (hasMemberships) return null
  if (isCreateCommunityPath(pathname) || isSignupPath(pathname)) return null
  const destination = '/create-community/name'
  return <Redirect to={destination} />
}

export function RedirectToCommunity ({ path, currentUser }) {
  return <Route path={path} exact render={redirectIfCommunity(currentUser)} />
}

export function redirectIfCommunity (currentUser) {
  return () => {
    if (!currentUser || currentUser.memberships.count() === 0) return <Loading type='top' />
    const mostRecentCommunity = currentUser.memberships
    .orderBy(m => new Date(m.lastViewedAt), 'desc')
    .first()
    .community

    return <Redirect to={`/c/${mostRecentCommunity.slug}`} />
  }
}
