import React from 'react'
import { Route } from 'react-router'
import EventDetail from 'events/EventDetail'
import EventList from 'events/EventList'

export default
  <Route path='events' components={{content: EventList}}>
    <Route path=':eventId' components={{detail: EventDetail}} />
  </Route>
