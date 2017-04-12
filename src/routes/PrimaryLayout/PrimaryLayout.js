
import React, { PropTypes, Component } from 'react'
import { matchPath, Route } from 'react-router-dom'
import cx from 'classnames'
import CommunitiesDrawer from './components/CommunitiesDrawer'
import Navigation from './components/Navigation'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import Feed from 'routes/Feed'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'
import Members from 'routes/Members'
import './PrimaryLayout.scss'

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
    const { location, community, currentUser, communitiesDrawerOpen, toggleCommunitiesDrawer } = this.props
    const communitySlug = community && community.slug
    const hasDetail = matchPath(location.pathname, {path: '/events/:eventId'})
    const closeDrawer = () => communitiesDrawerOpen && toggleCommunitiesDrawer()

    return <div styleName='container' onClick={closeDrawer}>
      {communitiesDrawerOpen && <CommunitiesDrawer />}
      <TopNav {...{community, currentUser}} />
      <div styleName='row'>
        <Navigation collapsed={hasDetail} />
        <div styleName='content'>
          <Route path='/' exact render={() => <Feed {...{community, currentUser}} />} />
          <Route path='/c/:slug' exact render={({ match }) => <Feed {...{community, currentUser, match}} />} />
          <Route path='/events' component={Events} />
          <Route path='/c/:slug/members' component={Members} />
        </div>
        <div styleName={cx('sidebar', {hidden: hasDetail})}>
          <Route path='/' component={Sidebar} />
        </div>
        <div styleName={cx('detail', {hidden: !hasDetail})}>
          {/*
            TODO: Display content of last detail page on '/' so that the
            animation transitions correctly.
            Best guess is to replace these routes with a render function
            defined above, and store the previous detail component in state
          */}
          <Route path='/events/:eventId' exact component={EventDetail} />
        </div>
      </div>
    </div>
  }
}
