import React, { PropTypes, Component } from 'react'
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
      </div>
    </div>
  }
}
