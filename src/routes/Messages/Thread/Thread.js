import PropTypes from 'prop-types'
import React from 'react'
import MessageSection from '../MessageSection'
import MessageForm from '../MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import SocketSubscriber from 'components/SocketSubscriber'
import Header from './Header'
import './Thread.scss'

const { func, object } = PropTypes

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
    const { thread, currentUser, id, onCloseURL } = this.props
    return <div styleName='thread'>
      <Header thread={thread} currentUser={currentUser} onCloseURL={onCloseURL} />
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
