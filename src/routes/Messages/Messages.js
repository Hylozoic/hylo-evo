import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import PeopleSelector from './PeopleSelector'
import ThreadList from './ThreadList'
import Thread from './Thread'
import './Messages.scss'

export default class Messages extends React.Component {
  constructor (props) {
    super(props)
    this.state = {onCloseURL: props.onCloseURL}
  }

  render () {
    const { onCloseURL } = this.state
    const {
      currentUser,
      currentThread,
      currentThreadId,
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
      fetchMessages,
      updateThreadReadTime,
      // MessageForm
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
          <Switch>
            <Route path='/t/new' component={props =>
              <PeopleSelector
                {...props}
                findOrCreateThread={findOrCreateThread}
                onCloseURL={onCloseURL}
                holoMode={holoMode}
            />} />
            <Route path='/t/:threadId' component={props =>
              <Thread
                id={currentThreadId}
                thread={currentThread}
                currentUser={currentUser}
                fetchThread={fetchThread}
                onCloseURL={onCloseURL}
                // passthroughs to MessageSection
                socket={socket}
                reconnectFetchMessages={reconnectFetchMessages}
                messages={messages}
                hasMoreMessages={hasMoreMessages}
                messagesPending={messagesPending}
                fetchMessages={fetchMessages}
                updateThreadReadTime={updateThreadReadTime}
                currentThread={currentThread}
                currentThreadId={currentThreadId}
                createMessage={createMessage}
                text={text}
                sendIsTyping={sendIsTyping}
                goToThread={goToThread}
                pending={pending}
                forNewThread={forNewThread}
                onFocus={onFocus}
                onBlur={onBlur}
                updateMessageText={updateMessageText}
                placeholder={placeholder}
              />}
            />
            <Redirect to='/t/new' />
          </Switch>
        </div>
      </div>
    </div>
  }
}
