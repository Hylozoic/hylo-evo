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
      holoMode,
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
      text,
      sendIsTyping,
      findOrCreateThread,
      goToThread,
      forNewThread,
      onFocus,
      onBlur,
      updateMessageText,
      placeholder
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
              holoMode={holoMode} />}
          {!forNewThread &&
            <Thread
              messageThreadId={currentMessageThreadId}
              messageThread={currentMessageThread}
              currentUser={currentUser}
              fetchThread={fetchThread}
              onCloseURL={onCloseURL}
              // passthroughs to MessageSection
              socket={socket}
              reconnectFetchMessages={reconnectFetchMessages}
              messages={messages}
              hasMoreMessages={hasMoreMessages}
              messageCreatePending={messageCreatePending}
              messagesPending={messagesPending}
              fetchMessages={fetchMessages}
              updateThreadReadTime={updateThreadReadTime}
              createMessage={createMessage}
              text={text}
              sendIsTyping={sendIsTyping}
              goToThread={goToThread}
              forNewThread={forNewThread}
              onFocus={onFocus}
              onBlur={onBlur}
              updateMessageText={updateMessageText}
              placeholder={placeholder} />
          }
        </div>
      </div>
    </div>
  }
}
