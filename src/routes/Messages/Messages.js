import React, { PropTypes, Component } from 'react'
import { Route, Switch } from 'react-router'

import PeopleSelector from 'components/PeopleSelector'
import ThreadList from 'components/ThreadList'
import Thread from 'components/Thread'
import './Messages.scss'
const { object } = PropTypes

export default class Messages extends Component {
  static propTypes = {
    match: object
  }

  render () {
    const { match: { params: { threadId } } } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList activeId={threadId} />
        <Switch>
          <Route path='/t/new' component={PeopleSelector} />
          <Route path='/t/:threadId' component={Thread} />
        </Switch>
      </div>
    </div>
  }
}
