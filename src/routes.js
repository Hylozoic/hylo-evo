import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import GeneralLayout from 'features/layout/GeneralLayout'
import EventDetail from 'features/events/EventDetail'
import EventList from 'features/events/EventList'

// LEJ: The following throws and error looking for Typography.js
//    import Typography from './components/Typography'
// Need to figure-out why webpack? is defaulting to adding the .js
// import Typography from './components/Typography/'

export default
  <Router history={hashHistory}>
    <Route path='/' component={GeneralLayout}>
      <Route path='events' components={{content: EventList}} />
      <Route path='events/:eventId' components={{content: EventList, detail: EventDetail}} />
    </Route>
  </Router>
