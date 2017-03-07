import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import GeneralLayout from 'features/layout/GeneralLayout'
import EventDetail from 'features/events/EventDetail'
import EventList from 'features/events/EventList'
import Feed from 'features/feed/Feed'
import UIKitRoutes from 'features/ui-kit/routes'

// LEJ: The following throws and error looking for Typography.js
//    import Typography from './components/Typography'
// Need to figure-out why webpack? is defaulting to adding the .js
// import Typography from './components/Typography/'

export default
  <Router history={hashHistory}>
    <Route path='/' component={GeneralLayout}>
      <IndexRoute components={{content: Feed}} />
      <Route path='events' components={{content: EventList}} />
      <Route path='events/:eventId' components={{content: EventList, detail: EventDetail}} />
    </Route>
    {UIKitRoutes}
  </Router>
