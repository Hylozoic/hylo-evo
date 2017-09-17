import React from 'react'

import { filter, get, map } from 'lodash/fp'
const { func, object } = React.PropTypes
import MessageSection from 'components/MessageSection'
import MessageForm from 'components/MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import CloseMessages from './CloseMessages'
import SocketSubscriber from 'components/SocketSubscriber'
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

  focusEditor = () => this.editor.focus()

  onThreadIdChange = () => {
    this.props.fetchThread()
    this.focusEditor()
  }

  render () {
    const { thread, currentUser, id } = this.props
    return <div styleName='thread'>
      <Header thread={thread} currentUser={currentUser} />
      <MessageSection thread={thread} messageThreadId={id} />
      <div styleName='message-form'>
        <MessageForm focusEditor={this.focusEditor} editorRef={textArea => this.editor = textArea} messageThreadId={id} ref='form' />
      </div>
      <PeopleTyping styleName='people-typing' />
      <SocketSubscriber type='post' id={id} />
    </div>
  }
}

function Header ({ thread, currentUser }) {
  const participants = get('participants', thread) || []
  const id = get('id', currentUser)
  const others = map('name', filter(f => f.id !== id, participants))
  const othersMinusLast = others.slice(0, others.length - 1)

  return <div styleName='header' id='thread-header'>
    <div styleName='header-text'>
      You{others.length > 1 ? `, ${othersMinusLast.join(', ')}` : ''} and {others[others.length - 1]}
    </div>
    <CloseMessages />
  </div>
}
