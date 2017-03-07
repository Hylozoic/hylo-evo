import React from 'react'
import { Route } from 'react-router'
import EventDetail from './EventDetail'
import Events from './index'

export default
  <Route path='events' components={{content: Events}}>
    <Route path=':eventId' components={{detail: EventDetail}} />
  </Route>
