import React from 'react'

import { filter, get, map } from 'lodash/fp'
const { func, object } = React.PropTypes
import Icon from 'components/Icon'
import MessageSection from 'components/MessageSection'
import MessageForm from 'components/MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import CloseMessages from './CloseMessages'
import './Thread.scss'

export default class Thread extends React.Component {
  static propTypes = {
    currentUser: object,
    thread: object,
    fetchThread: func,
    subscribe: func,
    unsubscribe: func
  }

  setupForThread () {
    this.props.fetchThread()
    this.reconnect = this.props.subscribe()
    this.refs.form.getWrappedInstance().focus()
  }

  teardownForThread () {
    this.props.unsubscribe(this.reconnect)
  }

  componentDidMount () {
    this.setupForThread()
  }

  componentDidUpdate (prevProps) {
    const oldId = get('thread.id', prevProps)
    const newId = get('thread.id', this.props)
    if (newId !== oldId && newId) this.setupForThread()
  }

  componentWillReceiveProps (nextProps) {
    const oldId = get('thread.id', this.props)
    const newId = get('thread.id', nextProps)
    if (newId !== oldId) this.teardownForThread()
  }

  componentWillUnmount () {
    this.teardownForThread()
  }

  render () {
    const { thread, currentUser } = this.props
    return <div styleName='thread'>
      <Header thread={thread} currentUser={currentUser} />
      <MessageSection thread={thread} messageThreadId={thread.id} />
      <div styleName='message-form'>
        <MessageForm messageThreadId={thread.id} ref='form' />
      </div>
      <PeopleTyping styleName='people-typing' />
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
    <Icon name='More' styleName='more-icon' />
    <CloseMessages />
  </div>
}
