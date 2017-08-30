import React, { PropTypes, Component } from 'react'
import { matchPath, Redirect, Route, Switch } from 'react-router-dom'
import cx from 'classnames'
import { get, some } from 'lodash/fp'
import Loading from 'components/Loading'
import Messages from 'routes/Messages'
import SocketListener from 'components/SocketListener'
import SocketSubscriber from 'components/SocketSubscriber'
import Drawer from './components/Drawer'
import Navigation from './components/Navigation'
import TopNav from './components/TopNav'
import CommunitySidebar from 'routes/CommunitySidebar'
import Feed from 'routes/Feed'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'
import MemberProfile from 'routes/MemberProfile'
import PostDetail from 'routes/PostDetail'
import PostEditorModal from 'components/PostEditorModal'
import Members from 'routes/Members'
import UserSettings from 'routes/UserSettings'
import CommunitySettings from 'routes/CommunitySettings'
import MemberSidebar from 'routes/MemberSidebar'
import AllTopics from 'routes/AllTopics'
import Search from 'routes/Search'
import NetworkSettings from 'routes/NetworkSettings'
import NetworkCommunities from 'routes/NetworkCommunities'
import SignupModal from 'routes/Signup/SignupModal'
import UploadPhoto from 'routes/Signup/UploadPhoto'
import AddLocation from 'routes/Signup/AddLocation'

import './PrimaryLayout.scss'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'

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

  render () {
    const {
      community,
      network,
      currentUser,
      isDrawerOpen,
      location,
      toggleDrawer,
      isCommunityRoute,
      showLogoBadge
    } = this.props

    if (isCommunityRoute && !community) {
      return <Loading type='fullscreen' />
    }

    const closeDrawer = () => isDrawerOpen && toggleDrawer()
    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, {path}),
      detailRoutes
    )

    console.log('props', this.props)

    // TODO move FullPageModals
    return <div styleName='container' onClick={closeDrawer}>
      <Drawer currentCommunity={community} styleName={cx('drawer', {hidden: !isDrawerOpen})} />
      <TopNav {...{community, network, currentUser, showLogoBadge}} styleName='top' />
      <div styleName='main'>
        <Navigation collapsed={hasDetail} styleName='left' />
        <div styleName='center' id={CENTER_COLUMN_ID}>
          <RedirectToSignupFlow currentUser={currentUser} pathname={this.props.location.pathname} />
          <RedirectToCommunity currentUser={currentUser} />
          <Switch>
            <Route path='/all' exact component={Feed} />
            <Route path='/all/:topicName' exact component={Feed} />
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
            <Route path='/n/:networkSlug/members' component={Members} />
            <Route path='/n/:networkSlug/settings' component={NetworkSettings} />
            <Route path='/n/:networkSlug/communities' component={NetworkCommunities} />
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
          </Switch>
        </div>
        <div styleName={cx('sidebar', {hidden: hasDetail})}>
          <Route path='/c/:slug/p/new' exact component={CommunitySidebar} />
          <Route path='/c/:slug' exact component={CommunitySidebar} />
          <Route path='/c/:slug/:topicName/p/new' exact component={CommunitySidebar} />
          <Route path='/c/:slug/:topicName' exact component={CommunitySidebar} />
          <Route path='/c/:slug/m/:id' component={MemberSidebar} />
          <Route path='/m/:id' component={MemberSidebar} />
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
  {path: '/c/:slug/:topicName/p/:postId/edit'}
]

const detailRoutes = [
  {path: '/events/:eventId', component: EventDetail},
  {path: `/all/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail},
  {path: `/c/:slug/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail},
  {path: `/c/:slug/m/:id/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail},
  {path: `/c/:slug/:topicName/p/:postId(${POST_ID_MATCH_REGEX})`, component: PostDetail}
]

const signupRoutes = [
  {path: '/signup/upload-photo', child: UploadPhoto},
  {path: '/signup/add-location', child: AddLocation}
]

export function isSignupPath (path) {
  return (path.substring(0, 7) === '/signup')
}

export function RedirectToSignupFlow ({ currentUser, pathname }) {
  if (!currentUser || !currentUser.settings.signupInProgress) return null
  if (isSignupPath(pathname)) return null
  const destination = '/signup/upload-photo'
  return <Redirect to={destination} />
}

export function RedirectToCommunity ({ currentUser }) {
  return <Route path='/' exact render={redirectIfCommunity(currentUser)} />
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
