import React, { PropTypes, Component } from 'react'
import { Route } from 'react-router'

import NewMessageThread from 'components/NewMessageThread'
import ThreadList from 'components/ThreadList'
import Thread from 'components/Thread'
import './Messages.scss'
const { object } = PropTypes

export default class Messages extends Component {
  static propTypes = {
    currentUser: object,
    match: object
  }

  render () {
    const { match: { params: { threadId } } } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList activeId={threadId} />
        {threadId ? <Thread threadId={threadId} /> : null}
        <Route path='/messages/new' component={NewMessageThread} />
      </div>
    </div>
  }
}
