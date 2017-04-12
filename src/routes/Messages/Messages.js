import React, { PropTypes, Component } from 'react'
import ThreadList from 'components/ThreadList'
import Thread from 'components/Thread'
import NewThread from 'components/NewThread'
import './Messages.scss'
const { array, object } = PropTypes

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
        {threadId ? <Thread id={threadId} /> : <NewThread />}
      </div>
    </div>
  }
}
