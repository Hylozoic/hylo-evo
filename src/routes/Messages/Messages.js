import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/fp'
// import getQuerystringParam from 'store/selectors/getQuerystringParam'
import PeopleSelector from './PeopleSelector'
import ThreadList from './ThreadList'
import Header from './Header'
import MessageSection from './MessageSection'
import MessageForm from './MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import SocketSubscriber from 'components/SocketSubscriber'
import './Messages.scss'

export const NEW_THREAD_ID = 'new'

export default class Messages extends React.Component {
  static defaultProps = {
    participants: [],
    threads: [],
    messages: [],
    socket: null
  }

  constructor (props) {
    super(props)

    this.state = {
      onCloseURL: props.onCloseURL,
      participants: props.participants,
      forNewThread: props.messageThreadId === NEW_THREAD_ID
    }
    this.form = React.createRef()
  }

  async componentDidMount () {
    await this.props.fetchPeople()
    await this.props.fetchThreads()
    await this.onThreadIdChange()
    // TODO: Handle querystring participants for Members Message button
    // const { participantSearch } = this.props
    // if (participantSearch) {
    //   participantSearch.forEach(p => this.props.addParticipant(p))
    //   this.props.changeQuerystringParam(this.props, 'participants', null)
    // }
  }

  componentDidUpdate (prevProps) {
    if (this.props.messageThreadId && this.props.messageThreadId !== prevProps.messageThreadId) {
      this.onThreadIdChange()
    }
  }

  onThreadIdChange = () => {
    const forNewThread = this.props.messageThreadId === NEW_THREAD_ID
    this.setState(() => ({ forNewThread }))
    if (!forNewThread) {
      this.props.fetchThread()
    }
    this.focusForm()
  }

  sendMessage = () => {
    if (!this.props.messageText || this.props.pending) return false
    this.setState(() => ({ participants: [] }))
    if (this.state.forNewThread) {
      this.sendNewMessage()
    } else {
      this.sendForExisting()
    }
    return false
  }

  sendForExisting () {
    const { createMessage, messageThreadId, messageText } = this.props
    createMessage(messageThreadId, messageText).then(() => this.focusForm())
  }

  async sendNewMessage () {
    const { findOrCreateThread, createMessage, goToThread, messageText } = this.props
    const { participants } = this.state
    const participantIds = participants.map(p => p.id)
    // TODO: Remove createdAt generation if not used by Hylo API
    const createdAt = new Date().getTime().toString()
    const createThreadResponse = await findOrCreateThread(participantIds, createdAt)
    // NOTE: This is a Redux vs Apollo data structure thing
    const messageThreadId = get('payload.data.findOrCreateThread.id', createThreadResponse) ||
      get('data.findOrCreateThread.id', createThreadResponse)
    await createMessage(messageThreadId, messageText, true)
    goToThread(messageThreadId)
  }

  addParticipant = (participant) => {
    this.setState(state => ({
      participants: [...state.participants, participant]
    }))
  }

  removeParticipant = (participant) => {
    this.setState(({ participants }) => ({
      participants: !participant
        ? participants.slice(0, participants.length - 1)
        : [...participants.filter(p => p.id !== participant.id)]
    }))
  }

  updateMessageText = messageText => {
    this.props.updateMessageText(this.props.messageThreadId, messageText)
  }

  focusForm = () => this.form.current && this.form.current.focus()

  render () {
    const {
      participants,
      onCloseURL
    } = this.state
    const {
      currentUser,
      messageThread,
      messageThreadId,
      threadsPending,
      threads,
      threadSearch,
      setThreadSearch,
      fetchMoreThreads,
      // MessageSection
      socket,
      messages,
      hasMoreMessages,
      messagesPending,
      messageCreatePending,
      fetchMessages,
      updateThreadReadTime,
      // MessageForm
      messageText,
      sendIsTyping,
      // PeopleSelector
      fetchRecentContacts,
      fetchPeople,
      setContactsSearch,
      holochainContacts,
      recentContacts
    } = this.props
    const { forNewThread } = this.state

    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList
          styleName='left-column'
          setThreadSearch={setThreadSearch}
          onScrollBottom={fetchMoreThreads}
          currentUser={currentUser}
          threadsPending={threadsPending}
          threads={threads}
          threadSearch={threadSearch} />
        <div styleName='right-column'>
          <div styleName='thread'>
            {forNewThread &&
              <PeopleSelector
                currentUser={currentUser}
                fetchPeople={fetchPeople}
                fetchDefaultList={fetchRecentContacts}
                setContactsSearch={setContactsSearch}
                contacts={holochainContacts}
                recentContacts={recentContacts}
                matches={holochainContacts}
                onCloseURL={onCloseURL}
                participants={participants}
                addParticipant={this.addParticipant}
                removeParticipant={this.removeParticipant} />}
            {!forNewThread &&
              <Header
                messageThread={messageThread}
                currentUser={currentUser}
                pending={messagesPending}
                onCloseURL={onCloseURL} />}
            {!forNewThread &&
              <MessageSection
                socket={socket}
                currentUser={currentUser}
                fetchMessages={fetchMessages}
                messages={messages}
                hasMore={hasMoreMessages}
                pending={messagesPending}
                updateThreadReadTime={updateThreadReadTime}
                messageThread={messageThread} />}
            {(!forNewThread || participants.length > 0) &&
              <div styleName='message-form'>
                <MessageForm
                  onSubmit={this.sendMessage}
                  currentUser={currentUser}
                  formRef={this.form}
                  updateMessageText={this.updateMessageText}
                  messageText={messageText}
                  sendIsTyping={sendIsTyping}
                  pending={messageCreatePending} />
              </div>}
            <PeopleTyping styleName='people-typing' />
            {socket && <SocketSubscriber type='post' id={messageThreadId} />}
          </div>
        </div>
      </div>
    </div>
  }
}

Messages.propTypes = {
  changeQuerystringParam: PropTypes.func,
  createMessage: PropTypes.func,
  currentUser: PropTypes.object,
  fetchMessages: PropTypes.func,
  fetchMoreThreads: PropTypes.func,
  fetchPeople: PropTypes.func,
  fetchRecentContacts: PropTypes.func,
  fetchThread: PropTypes.func,
  fetchThreads: PropTypes.func,
  findOrCreateThread: PropTypes.func,
  goToThread: PropTypes.func,
  hasMoreMessages: PropTypes.bool,
  holochainContacts: PropTypes.array,
  location: PropTypes.object,
  messageCreatePending: PropTypes.bool,
  messageText: PropTypes.string,
  messageThread: PropTypes.object,
  messageThreadId: PropTypes.string,
  messages: PropTypes.array,
  messagesPending: PropTypes.bool,
  onCloseURL: PropTypes.string,
  participants: PropTypes.array,
  recentContacts: PropTypes.array,
  sendIsTyping: PropTypes.func,
  setContactsSearch: PropTypes.func,
  setThreadSearch: PropTypes.func,
  socket: PropTypes.object,
  threadSearch: PropTypes.string,
  threads: PropTypes.array,
  threadsPending: PropTypes.bool,
  updateMessageText: PropTypes.func,
  updateThreadReadTime: PropTypes.func
}
