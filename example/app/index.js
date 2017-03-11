import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

const helloWorld = (props) => <div>{props.route.text}</div>;

const router =
<Router>
  <Route path='/' component={helloWorld} text='Hello, World this dsfffa it might work after all!!!!' />
  <Route path='hello2' component={helloWorld} text='Goodbye!!!!!!!!!!! Goodbye!!!!!!!!!!!' />
</Router>

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  // ReactDOM.render(routes, document.getElementById('root'))
}

export default router;
