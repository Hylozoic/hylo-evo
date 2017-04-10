import React, { PropTypes, Component } from 'react'
import ThreadList from 'components/ThreadList'
import Thread from 'components/Thread'
import NewThread from 'components/NewThread'
import './Messages.scss'
const { array, object } = PropTypes

export default class Messages extends Component {
  static propTypes = {
    currentUser: object,
    match: object,
    threads: array
  }

  render () {
    const { match: { params: { threadId } }, threads } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList activeId={threadId} threads={threads} />
        {threadId ? <Thread id={threadId} /> : <NewThread />}
      </div>
    </div>
  }
}
