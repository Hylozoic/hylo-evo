import React from 'react'
import { Route } from 'react-router'
import EventDetail from './EventDetail'
import EventList from './EventList'

const routes = (
  <Route path='events' components={{content: EventList}}>
    <Route path=':eventId' components={{detail: EventDetail}} />
  </Route>
)

export default routes
