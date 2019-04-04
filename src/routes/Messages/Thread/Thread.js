import PropTypes from 'prop-types'
import React from 'react'
import MessageSection from '../MessageSection'
import MessageForm from '../MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import SocketSubscriber from 'components/SocketSubscriber'
import Header from './Header'
import './Thread.scss'

const { string, func, object, bool } = PropTypes

export default class Thread extends React.Component {
  static propTypes = {
    id: string,
    currentUser: object,
    thread: object,
    fetchThread: func,
    onCloseURL: string,
    // Pass throughs
    socket: object,
    reconnectFetchMessages: func,
    messages: object,
    hasMoreMessages: bool,
    messagesPending: bool,
    fetchMessages: func,
    updateThreadReadTime: func,
    currentThread: object,
    currentThreadId: string,
    totalMessages: string
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
    const {
      id,
      thread,
      currentUser,
      onCloseURL,
      socket,
      reconnectFetchMessages,
      messages,
      hasMoreMessages,
      messagesPending,
      fetchMessages,
      updateThreadReadTime,
      createMessage,
      text,
      sendIsTyping,
      findOrCreateThread,
      goToThread,
      pending,
      forNewThread,
      onFocus,
      onBlur,
      updateMessageText,
      placeholder
    } = this.props
    return <div styleName='thread'>
      <Header thread={thread} currentUser={currentUser} onCloseURL={onCloseURL} />
      <MessageSection
        currentUser={currentUser}
        socket={socket}
        reconnectFetchMessages={reconnectFetchMessages} 
        messages={messages}
        hasMore={hasMoreMessages}
        messagesPending={messagesPending}
        fetchMessages={fetchMessages}
        updateThreadReadTime={updateThreadReadTime}
        thread={thread}
        messageThreadId={id}
      />
      <div styleName='message-form'>
        <MessageForm
          currentUser={currentUser}
          formRef={textArea => this.form = textArea} // eslint-disable-line no-return-assign
          focusForm={this.focusForm}
          messageThreadId={id}
          createMessage={createMessage}
          text={text}
          sendIsTyping={sendIsTyping}
          findOrCreateThread={findOrCreateThread}
          goToThread={goToThread}
          pending={pending}
          forNewThread={forNewThread}
          onFocus={onFocus}
          onBlur={onBlur}
          updateMessageText={updateMessageText}
          placeholder={placeholder}
        />
      </div>
      <PeopleTyping styleName='people-typing' />
      <SocketSubscriber type='post' id={id} />
    </div>
  }
}
