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
import MessageMember from 'components/MessageMember'
import AllTopics from 'routes/AllTopics'
import Search from 'routes/Search'
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
      currentUser,
      isDrawerOpen,
      location,
      toggleDrawer,
      isCommunityRoute
    } = this.props

    if (isCommunityRoute && !community) {
      return <Loading type='fullscreen' />
    }

    const closeDrawer = () => isDrawerOpen && toggleDrawer()
    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, {path}),
      detailRoutes
    )
    // TODO move FullPageModals
    return <div styleName='container' onClick={closeDrawer}>
      {isDrawerOpen && <Drawer currentCommunity={community} />}
      <TopNav {...{community, currentUser}} styleName='top' />
      <div styleName='main'>
        <Navigation collapsed={hasDetail} styleName='left' />
        <div styleName='center' id={CENTER_COLUMN_ID}>
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
            <Route path='/events' component={Events} />
            <Route path='/settings' component={UserSettings} />
            <Route path='/search' component={Search} />
          </Switch>
        </div>
        <div styleName={cx('sidebar', {hidden: hasDetail})}>
          <Route path='/c/:slug/p/new' exact component={CommunitySidebar} />
          <Route path='/c/:slug' exact component={CommunitySidebar} />
          <Route path='/c/:slug/:topicName/p/new' exact component={CommunitySidebar} />
          <Route path='/c/:slug/:topicName' exact component={CommunitySidebar} />
          <Route path='/c/:slug/m/:id' component={MessageMember} />
          <Route path='/m/:id' component={MessageMember} />
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
