import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import App from 'App'
import OfferCardsMain from 'components/OfferCardsMain'
import OfferCardsSidebar from 'components/OfferCardsSidebar'
import EventList from 'components/EventList'
import EventListSidebar from 'components/EventListSidebar'
import EventPage from 'components/EventPage'

// LEJ: The following throws and error looking for Typography.js
//    import Typography from './components/Typography'
// Need to figure-out why webpack? is defaulting to adding the .js
// import Typography from './components/Typography/'


export default
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute components={{main: OfferCardsMain, sidebar: OfferCardsSidebar}} />
      <Route path='events' components={{main: EventList, sidebar: EventListSidebar}} />
      <Route path='events/:eventId' components={{main: EventList, sidebar: EventPage}} />
    </Route>
  </Router>
