import React from 'react';
import ReactDOM from 'react-dom'
import routes from './routes'

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  ReactDOM.render(routes, document.getElementById('root'))
}

export default routes;
