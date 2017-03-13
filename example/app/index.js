import React from 'react';
import ReactDOM from 'react-dom';

// http://stackoverflow.com/questions/33403549/cannot-access-dom-with-server-side-render-react-0-14-1-react-dom-0-14-1-and-r
// import createBrowserHistory from 'react-router/node_modules/history'
// import { createHistory } from 'history'
// var history = require('history/lib/createBrowserHistory').createHistory

import {
  Router,
  RouterContext,
  Route,
  IndexRoute,
  browserHistory
} from 'react-router'

const helloWorld = (props) => <div>{props.route.text}</div>;

const routes = <Router history={browserHistory}>
  <Route path='/' component={helloWorld} text='Hello, World this dsfffa it might work after all!!!!' />,
  <Route path='hello2' component={helloWorld} text='Goodbye!!!!!!!!!!! Goodbye!!!!!!!!!!!' />
</Router>

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  ReactDOM.render(routes, document.getElementById('root'))
}

export default router;
