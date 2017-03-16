import React from 'react'
import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

const HelloWorld = (props) => <div>{props.text}</div>

const router = <BrowserRouter>
  <div>
    <Route path='/' exact render={() => <HelloWorld text='hello!' />} />,
    <Route path='/goodbye' render={() => <HelloWorld text='goodbye!' />} />
  </div>
</BrowserRouter>

let result

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  ReactDOM.render(router, document.getElementById('root'))
  result = router
} else {
  result = renderToString(router)
}

export default result
