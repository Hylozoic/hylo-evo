import React, { PropTypes, Component } from 'react'
import { matchPath, Redirect, Route } from 'react-router-dom'
import cx from 'classnames'
import { some } from 'lodash/fp'
import Loading from 'components/Loading'
import Messages from 'routes/Messages'
import SocketListener from 'components/SocketListener'
import Drawer from './components/Drawer'
import Navigation from './components/Navigation'
import TopNav from './components/TopNav'
import CommunitySidebar from 'routes/CommunitySidebar'
import CommunityFeed from 'routes/CommunityFeed'
import AllCommunitiesFeed from 'routes/AllCommunitiesFeed'
import Events from 'routes/Events'

import EventDetail from 'routes/Events/EventDetail'
import MemberProfile from 'routes/MemberProfile'
import PostDetail from 'routes/PostDetail'
import Members from 'routes/Members'
import Settings from 'routes/Settings'
import MessageMember from 'components/MessageMember'
import HyloModal from 'routes/HyloModal'
import PostEditor from 'components/PostEditor'
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
          <Route path='/all' component={AllCommunitiesFeed} />
          <Route path='/c/:slug' exact component={CommunityFeed} />
          <Route path='/c/:slug/p/:postId' component={CommunityFeed} />
          <Route path='/c/:slug/m/:id' component={MemberProfile} />
          <Route path='/events' component={Events} />
          <Route path='/c/:slug/members' component={Members} />
          <Route path='/settings' component={Settings} />
        </div>
        <div styleName={cx('sidebar', {hidden: hasDetail})}>
          <PostEditor />
          <Route path='/c/:slug' exact component={CommunitySidebar} />
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
          {detailRoutes.map(({ path, editComponent }) =>
            <Route key={`${path}/edit`} path={`${path}/edit`} component={editComponent} />)}
        </div>
      </div>
      <Route path='/messages' exact component={Messages} />
      <Route path='/messages/new' exact component={Messages} />
      <Route path='/t/:threadId' component={Messages} />
      <SocketListener location={location} />
    </div>
  }
}

const detailRoutes = [
  {path: '/events/:eventId', component: EventDetail},
  {path: '/all/p/:postId', component: PostDetail, editComponent: HyloModal},
  {path: '/c/:slug/p/:postId', component: PostDetail, editComponent: HyloModal}
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
