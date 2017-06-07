import React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import PeopleSelector from 'components/PeopleSelector'
import ThreadList from 'components/ThreadList'
import Thread from 'components/Thread'
import './Messages.scss'

export default function Messages () {
  return <div styleName='modal'>
    <div styleName='content'>
      <Route path='/t/:threadId?' component={ThreadList} />
      <Switch>
        <Route path='/t/new' component={PeopleSelector} />
        <Route path='/t/:threadId' component={Thread} />
        <Redirect to='/t/new' />
      </Switch>
    </div>
  </div>
}
