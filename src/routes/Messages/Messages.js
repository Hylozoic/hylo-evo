import React, { PropTypes, Component } from 'react'
import ThreadList from 'components/ThreadList'
import Thread from 'components/Thread'
import './Messages.scss'
import { getSocket } from 'client/websockets'
const { object } = PropTypes

export default class Messages extends Component {
  static propTypes = {
    currentUser: object,
    match: object
  }

  componentDidMount () {
    // FIXME this doesn't belong here
    this.props.fetchCurrentUser()
  }

  render () {
    const { match: { params: { threadId } } } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList activeId={threadId} />
        {threadId ? <Thread threadId={threadId} socket={getSocket()} /> : null}
      </div>
    </div>
  }
}
