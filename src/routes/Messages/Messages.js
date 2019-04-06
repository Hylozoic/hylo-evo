import React from 'react'
import PeopleSelector from './PeopleSelector'
import ThreadList from './ThreadList'
import Thread from './Thread'
import './Messages.scss'

export default class Messages extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      onCloseURL: props.onCloseURL
    }
  }

  render () {
    const { onCloseURL } = this.state
    const {
      currentUser,
      currentMessageThread,
      currentMessageThreadId,
      threads,
      threadSearch,
      setThreadSearch,
      fetchThread,
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
      updateMessageText
    } = this.props

    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList
          styleName='left-column'
          currentUser={currentUser}
          threads={threads}
          threadSearch={threadSearch}
          setThreadSearch={setThreadSearch}
          fetchThreads={fetchThreads}
          fetchMoreThreads={fetchMoreThreads}
        />
        <div styleName='right-column'>
          {forNewThread &&
            <PeopleSelector
              {...this.props}
              messageThreadId={currentMessageThreadId}
              findOrCreateThread={findOrCreateThread}
              onCloseURL={onCloseURL}
              holochainActive={holochainActive} />}
          {!forNewThread &&
            <Thread
              messageThreadId={currentMessageThreadId}
              messageThread={currentMessageThread}
              currentUser={currentUser}
              fetchThread={fetchThread}
              onCloseURL={onCloseURL}
              // passthroughs to MessageSection
              messages={messages}
              fetchMessages={fetchMessages}
              reconnectFetchMessages={reconnectFetchMessages}
              hasMoreMessages={hasMoreMessages}
              messagesPending={messagesPending}
              updateThreadReadTime={updateThreadReadTime}
              // passthrough to MessageForm
              createMessage={createMessage}
              findOrCreateThread={findOrCreateThread}
              messageCreatePending={messageCreatePending}
              messageText={messageText}
              forNewThread={forNewThread}
              updateMessageText={updateMessageText} 
              goToThread={goToThread}
              socket={socket}
              sendIsTyping={sendIsTyping} />}
        </div>
      </div>
    </div>
  }
}
