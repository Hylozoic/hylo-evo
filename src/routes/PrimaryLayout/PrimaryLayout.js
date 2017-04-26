import React, { PropTypes, Component } from 'react'
import { matchPath, Redirect, Route } from 'react-router-dom'
import cx from 'classnames'
import { flow, map, some, identity } from 'lodash/fp'
import Loading from 'components/Loading'
import CommunitiesDrawer from './components/CommunitiesDrawer'
import Navigation from './components/Navigation'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import CommunityFeed from 'routes/CommunityFeed'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'
import MemberProfile from 'routes/MemberProfile'
import PostDetail from 'routes/PostDetail'
import Members from 'routes/Members'
import Settings from 'routes/Settings'
import MessageMember from 'components/MessageMember'
import './PrimaryLayout.scss'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'

export default class PrimaryLayout extends Component {
  static propTypes = {
    community: PropTypes.object,
    currentUser: PropTypes.object,
    location: PropTypes.object,
    communitiesDrawerOpen: PropTypes.bool,
    toggleCommunitiesDrawer: PropTypes.func
  }

  componentDidMount () {
    // FIXME this doesn't belong here
    this.props.fetchCurrentUser()
  }

  render () {
    const {
      community,
      currentUser,
      communitiesDrawerOpen,
      location,
      toggleCommunitiesDrawer
    } = this.props

    const hasDetail = flow(
      map(path => matchPath(location.pathname, {path: path})),
      some(identity)
    )([
      '/events/:eventId',
      '/p/:postId',
      '/c/:slug/p/:postId'
    ])

    const closeDrawer = () => communitiesDrawerOpen && toggleCommunitiesDrawer()

    return <div styleName='container' onClick={closeDrawer}>
      {communitiesDrawerOpen && <CommunitiesDrawer />}
      <TopNav {...{community, currentUser}} styleName='top' />
      <div styleName='main'>
        <Navigation collapsed={hasDetail} styleName='left' />
        <div styleName='center' id={CENTER_COLUMN_ID}>
          <RedirectToCommunity currentUser={currentUser} />
          <Route path='/c/:slug/' exact component={CommunityFeed} />
          <Route path='/c/:slug/p/:postId' component={CommunityFeed} />
          <Route path='/c/:slug/m/:id' component={MemberProfile} />
          <Route path='/events' component={Events} />
          <Route path='/c/:slug/members' component={Members} />
          <Route path='/settings' component={Settings} />
        </div>
        <div styleName={cx('sidebar', {hidden: hasDetail})}>
          <Route path='/c/:slug' exact component={Sidebar} />
          <Route path='/c/:slug/m/:id' component={MessageMember} />
        </div>
        <div styleName={cx('detail', {hidden: !hasDetail})} id={DETAIL_COLUMN_ID}>
          {/*
            TODO: Display content of last detail page on '/' so that the
            animation transitions correctly.
            Best guess is to replace these routes with a render function
            defined above, and store the previous detail component in state
          */}
          <Route path='/events/:eventId' exact component={EventDetail} />
          <Route path='/p/:postId' exact component={PostDetail} />
          <Route path='/c/:slug/p/:postId' exact component={PostDetail} />
        </div>
      </div>
    </div>
  }
}

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
