import React from 'react'

import { filter, get, map, isEmpty } from 'lodash/fp'
const { func, object } = React.PropTypes
import MessageSection from 'components/MessageSection'
import MessageForm from 'components/MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import CloseMessages from './CloseMessages'
import SocketSubscriber from 'components/SocketSubscriber'
import { formatNames } from 'store/models/MessageThread'
import './Thread.scss'

export default class Thread extends React.Component {
  static propTypes = {
    currentUser: object,
    thread: object,
    fetchThread: func
  }

  componentDidMount () {
    this.onThreadIdChange()
  }

  componentDidUpdate (prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.onThreadIdChange()
    }
  }

  focusForm = () => this.form.focus()

  onThreadIdChange = () => {
    this.props.fetchThread()
    this.focusForm()
  }

  render () {
    const { thread, currentUser, id } = this.props
    return <div styleName='thread'>
      <Header thread={thread} currentUser={currentUser} />
      <MessageSection thread={thread} messageThreadId={id} />
      <div styleName='message-form'>
        <MessageForm
          formRef={textArea => this.form = textArea} // eslint-disable-line no-return-assign
          focusForm={this.focusForm}
          messageThreadId={id} />
      </div>
      <PeopleTyping styleName='people-typing' />
      <SocketSubscriber type='post' id={id} />
    </div>
  }
}

export function Header ({ thread, currentUser }) {
  const participants = get('participants', thread) || []
  const id = get('id', currentUser)
  const others = map('name', filter(f => f.id !== id, participants))

  const headerText = isEmpty(others) 
    ? 'You'
    : formatNames(others)

  return <div styleName='header' id='thread-header'>
    <div styleName='header-text'>
      {headerText}
    </div>
    <CloseMessages />
  </div>
}
