import React from 'react'
import PropTypes from 'prop-types'
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

  componentDidMount () {
    this.onThreadIdChange()
    this.props.fetchPeople()
    // TODO: Handle querystring participants for Members Message button
    // const { participantSearch } = this.props
    // if (participantSearch) {
    //   participantSearch.forEach(p => this.props.addParticipant(p))
    //   this.props.changeQuerystringParam(this.props, 'participants', null)
    // }
    // Here is some of the stuff that was used to make it...
    // import getQuerystringParam from 'store/selectors/getQuerystringParam'
    // participantIdsSearch: getQuerystringParam('participants', null, props),
    // export function getParticipantSearch (props, participantsFromStore) {
    //   const participantIds = getQuerystringParam('participants', null, props)
    //   if (participantIds) {
    //     return participantIds
    //       .split(',')
    //       .filter(pId => !participantsFromStore.find(participant => participant.id === pId))
    //   }
    //   return null
    // }
    // const { participantIdsSearch } = this.props
    // if (participantIdsSearch) {
    //   participantIdsSearch.forEach(p => this.addParticipant(p))
    //   this.props.changeQuerystringParam(this.props, 'participants', null)
    // }
  }

  componentDidUpdate (prevProps) {
    if (this.props.messageThreadId && this.props.messageThreadId !== prevProps.messageThreadId) {
      this.onThreadIdChange()
    }
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

  focusForm = () => this.form.current && this.form.current.focus()

  onThreadIdChange = () => {
    const forNewThread = this.props.messageThreadId === NEW_THREAD_ID
    this.setState(() => ({ forNewThread }))
    if (!forNewThread) {
      this.props.fetchThread()
    }
    this.focusForm()
  }

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
      fetchThreads,
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
      createMessage,
      messageText,
      sendIsTyping,
      findOrCreateThread,
      goToThread,
      updateMessageText,
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
                  messageThreadId={messageThreadId}
                  currentUser={currentUser}
                  formRef={this.form}
                  focusForm={this.focusForm}
                  createMessage={createMessage}
                  participants={participants}
                  messageText={messageText}
                  sendIsTyping={sendIsTyping}
                  findOrCreateThread={findOrCreateThread}
                  goToThread={goToThread}
                  pending={messageCreatePending}
                  forNewThread={forNewThread}
                  updateMessageText={updateMessageText} />
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
  holochainActive: PropTypes.bool,
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
