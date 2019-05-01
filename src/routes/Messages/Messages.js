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
  static defaultProps = {
    participants: []
  }

  constructor (props) {
    super(props)

    this.state = {
      onCloseURL: props.onCloseURL,
      participants: props.participants
    }
    this.form = React.createRef()
  }

  componentDidMount () {
    this.onThreadIdChange()

    // TODO: Handle this
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
    if (!this.props.forNewThread) this.props.fetchThread()
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
                holochainActive={holochainActive}
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
            <SocketSubscriber type='post' id={messageThreadId} />
          </div>
        </div>
      </div>
    </div>
  }
}
