import React from 'react'
import PeopleSelector from './PeopleSelector'
import ThreadList from './ThreadList'
import Header from './Header'
import MessageSection from './MessageSection'
import MessageForm from './MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import SocketSubscriber from 'components/SocketSubscriber'
import './Messages.scss'

export default class Messages extends React.Component {
  // TODO: A bug - new message to existing thread doesn't pop that thread to the top
  constructor (props) {
    super(props)

    this.state = {
      onCloseURL: props.onCloseURL
    }
    this.form = React.createRef()
  }

  componentDidMount () {
    this.onThreadIdChange()
  }

  componentDidUpdate (prevProps) {
    if (this.props.messageThreadId && this.props.messageThreadId !== prevProps.messageThreadId) {
      this.onThreadIdChange()
    }
  }

  focusForm = () => this.form.current && this.form.current.focus()

  onThreadIdChange = () => {
    if (!this.props.forNewThread) this.props.fetchThread()
    this.focusForm()
  }

  render () {
    const { onCloseURL } = this.state
    const {
      currentUser,
      messageThread,
      messageThreadId,
      threadsPending,
      threads,
      threadSearch,
      setThreadSearch,
      fetchThreads,
      fetchMoreThreads,
      holochainActive,
      // MessageSection
      socket,
      reconnectFetchMessages,
      messages,
      hasMoreMessages,
      messagesPending,
      messageCreatePending,
      fetchMessages,
      updateThreadReadTime,
      // MessageForm
      createMessage,
      messageText,
      sendIsTyping,
      findOrCreateThread,
      goToThread,
      forNewThread,
      updateMessageText,
      participants
    } = this.props

    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList
          styleName='left-column'
          currentUser={currentUser}
          threadsPending={threadsPending}
          threads={threads}
          threadSearch={threadSearch}
          setThreadSearch={setThreadSearch}
          fetchThreads={fetchThreads}
          fetchMoreThreads={fetchMoreThreads}
        />
        <div styleName='right-column'>
          <div styleName='thread'>
            {forNewThread &&
              <PeopleSelector
                location={this.props.location}
                onCloseURL={onCloseURL}
                holochainActive={holochainActive} />}
            {!forNewThread &&
              <Header
                messageThread={messageThread}
                currentUser={currentUser}
                onCloseURL={onCloseURL} />}
            {!forNewThread &&
              <MessageSection
                socket={socket}
                currentUser={currentUser}
                messageThread={messageThread}
                reconnectFetchMessages={reconnectFetchMessages}
                messages={messages}
                hasMore={hasMoreMessages}
                pending={messagesPending}
                fetchMessages={fetchMessages}
                updateThreadReadTime={updateThreadReadTime} />}
            {(!forNewThread || participants.length > 0) &&
              <div styleName='message-form'>
                <MessageForm
                  messageThreadId={messageThreadId}
                  currentUser={currentUser}
                  formRef={this.form}
                  focusForm={this.focusForm}
                  createMessage={createMessage}
                  messageText={messageText}
                  sendIsTyping={sendIsTyping}
                  findOrCreateThread={findOrCreateThread}
                  goToThread={goToThread}
                  pending={messageCreatePending}
                  forNewThread={forNewThread}
                  updateMessageText={updateMessageText} />
              </div>}
            <PeopleTyping styleName='people-typing' />
            <SocketSubscriber type='post' id={messageThreadId} />
          </div>
        </div>
      </div>
    </div>
  }
}
