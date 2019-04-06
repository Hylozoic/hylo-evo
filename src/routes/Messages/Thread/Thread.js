import PropTypes from 'prop-types'
import React from 'react'
import MessageSection from '../MessageSection'
import MessageForm from '../MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import SocketSubscriber from 'components/SocketSubscriber'
import Header from './Header'
import './Thread.scss'

const { string, func, array, object, bool } = PropTypes

export default class Thread extends React.Component {
  // TODO: Update to reflect real full props list
  static propTypes = {
    messageThreadId: string,
    messageThread: object,
    currentUser: object,
    fetchThread: func,
    onCloseURL: string,
    // Passthroughs
    socket: object,
    reconnectFetchMessages: func,
    messages: array,
    hasMoreMessages: bool,
    messagesPending: bool,
    fetchMessages: func,
    updateThreadReadTime: func
  }

  // TODO: Move this all up to Messages
  componentDidMount () {
    this.onThreadIdChange()
  }

  componentDidUpdate (prevProps) {
    if (this.props.messageThreadId && this.props.messageThreadId !== prevProps.messageThreadId) {
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
      messageThreadId,
      messageThread,
      currentUser,
      onCloseURL,
      socket,
      reconnectFetchMessages,
      messages,
      hasMoreMessages,
      messagesPending,
      messageCreatePending,
      fetchMessages,
      updateThreadReadTime,
      createMessage,
      messageText,
      sendIsTyping,
      findOrCreateThread,
      goToThread,
      forNewThread,
      onFocus,
      onBlur,
      updateMessageText,
      placeholder
    } = this.props

    return <div styleName='thread'>
      <Header
        messageThread={messageThread}
        currentUser={currentUser}
        onCloseURL={onCloseURL} />
      <MessageSection
        socket={socket}
        currentUser={currentUser}
        messageThreadId={messageThreadId}
        messageThread={messageThread}
        reconnectFetchMessages={reconnectFetchMessages}
        messages={messages}
        hasMore={hasMoreMessages}
        pending={messagesPending}
        fetchMessages={fetchMessages}
        updateThreadReadTime={updateThreadReadTime} />
      <div styleName='message-form'>
        <MessageForm
          messageThreadId={messageThreadId}
          currentUser={currentUser}
          formRef={textArea => this.form = textArea} // eslint-disable-line no-return-assign
          focusForm={this.focusForm}
          createMessage={createMessage}
          messageText={messageText}
          sendIsTyping={sendIsTyping}
          findOrCreateThread={findOrCreateThread}
          goToThread={goToThread}
          pending={messageCreatePending}
          forNewThread={forNewThread}
          onFocus={onFocus}
          onBlur={onBlur}
          updateMessageText={updateMessageText}
          placeholder={placeholder} />
      </div>
      <PeopleTyping styleName='people-typing' />
      <SocketSubscriber type='post' id={messageThreadId} />
    </div>
  }
}
