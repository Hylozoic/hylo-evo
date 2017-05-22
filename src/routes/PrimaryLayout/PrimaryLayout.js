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
import Members from 'routes/Members'
import UserSettings from 'routes/UserSettings'
import MessageMember from 'components/MessageMember'
import PostEditorModal from 'components/PostEditorModal'
import AllTopics from 'routes/AllTopics'
import './PrimaryLayout.scss'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'

export default class PrimaryLayout extends Component {
  static propTypes = {
    community: PropTypes.object,
    currentUser: PropTypes.object,
    location: PropTypes.object,
    isDrawerOpen: PropTypes.bool,
    toggleDrawer: PropTypes.func
  }

  componentDidMount () {
    // FIXME this doesn't belong here
    this.props.fetchCurrentUser()
  }

  render () {
    const {
      community,
      currentUser,
      isDrawerOpen,
      location,
      toggleDrawer
    } = this.props

    const closeDrawer = () => isDrawerOpen && toggleDrawer()
    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, {path}),
      detailRoutes
    )

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
            <Route path='/all/p/:postId' exact component={Feed} />
            <Route path='/c/:slug' exact component={Feed} />
            <Route path='/c/:slug/members' component={Members} />
            <Route path='/c/:slug/m/:id' component={MemberProfile} />
            <Route path='/c/:slug/p/new' component={PostEditorModal} />
            <Route path='/c/:slug/p/:postId' component={Feed} />
            <Route path='/c/:slug/topics' component={AllTopics} />
            <Route path='/c/:slug/:topicName/p/:postId' component={Feed} />
            <Route path='/c/:slug/:topicName' component={Feed} />
            <Route path='/events' component={Events} />
            <Route path='/settings' component={UserSettings} />
          </Switch>
        </div>
        <div styleName={cx('sidebar', {hidden: hasDetail})}>
          <Route path='/c/:slug' exact component={CommunitySidebar} />
          <Route path='/c/:slug/:topicName' exact component={CommunitySidebar} />
          <Route path='/c/:slug/m/:id' component={MessageMember} />
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
    </div>
  }
}

const detailRoutes = [
  {path: '/events/:eventId', component: EventDetail},
  {path: '/all/p/new', component: PostEditorModal},
  {path: '/all/p/:postId', component: PostDetail},
  {path: '/all/p/:postId/edit', component: PostEditorModal},
  {path: '/c/:slug/p/new', component: PostEditorModal},
  {path: '/c/:slug/p/:postId', component: PostEditorModal},
  {path: '/c/:slug/p/:postId/edit', component: PostEditorModal},
  {path: '/c/:slug/m/:id/p/new', component: PostEditorModal},
  {path: '/c/:slug/m/:id/p/:postId', component: PostDetail},
  {path: '/c/:slug/m/:id/p/:postId/edit', component: PostEditorModal},
  {path: '/c/:slug/:topicName/p/new', component: PostEditorModal},
  {path: '/c/:slug/:topicName/p/:postId', component: PostDetail},
  {path: '/c/:slug/:topicName/p/:postId/edit', component: PostEditorModal}
]

function RedirectToCommunity ({ currentUser }) {
  return <Route path='/' exact render={() => {
    if (!currentUser) return <Loading type='top' />

    const mostRecentCommunity = currentUser.memberships
    .orderBy(m => new Date(m.lastViewedAt), 'desc')
    .first()
    .community

    return <Redirect to={`/c/${mostRecentCommunity.slug}`} />
  }} />
}
