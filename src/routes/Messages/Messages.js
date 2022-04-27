import React from 'react'
import { Link, Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { get } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import CloseMessages from './CloseMessages'
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
      forNewThread: props.messageThreadId === NEW_THREAD_ID,
      loading: true,
      peopleSelectorOpen: false,
      onCloseURL: props.onCloseURL,
      participants: []
    }
    this.form = React.createRef()
  }

  async componentDidMount () {
    await this.props.fetchThreads()
    await this.props.fetchPeople({})
    this.setState(() => ({ loading: false }))
    this.onThreadIdChange()

    const { participants, prompt } = this.props

    if (participants) {
      participants.forEach(p => this.addParticipant(p))
      this.props.changeQuerystringParam(this.props, 'participants', null)
    }

    if (prompt) {
      this.updateMessageText(prompt)
      this.props.changeQuerystringParam(this.props, 'prompt', null)
    }
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
    createMessage(messageThreadId, TextHelpers.markdown(messageText)).then(() => this.focusForm())
  }

  setPeopleSelectorOpen (val) {
    this.setState({ peopleSelectorOpen: val })
  }

  async sendNewMessage () {
    const { findOrCreateThread, createMessage, goToThread, messageText } = this.props
    const { participants } = this.state
    const participantIds = participants.map(p => p.id)
    const createThreadResponse = await findOrCreateThread(participantIds)
    // * This is a Redux vs Apollo data structure thing
    const messageThreadId = get('payload.data.findOrCreateThread.id', createThreadResponse) ||
      get('data.findOrCreateThread.id', createThreadResponse)
    await createMessage(messageThreadId, TextHelpers.markdown(messageText), true)
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
      fetchMessages,
      messageCreatePending,
      updateThreadReadTime,
      // MessageForm
      messageText,
      sendIsTyping,
      // PeopleSelector
      fetchRecentContacts,
      fetchPeople,
      setContactsSearch,
      contacts
    } = this.props
    const {
      loading,
      onCloseURL,
      participants,
      peopleSelectorOpen
    } = this.state
    const { forNewThread } = this.state

    return <div styleName={cx('modal', { messagesOpen: messageThreadId })}>
      <div styleName='content'>
        <div styleName='messages-header'>
          <div styleName='close-messages'>
            <CloseMessages onCloseURL={onCloseURL} />
          </div>
          <div styleName='messages-title'>
            <Icon name='Messages' />
            { !forNewThread
              ? <h3>Messages</h3>
              : <h3>New Message</h3>
            }
          </div>
        </div>
        {loading
          ? <div styleName='modal'><Loading /></div>
          : <React.Fragment>
            <ThreadList
              styleName='left-column'
              setThreadSearch={setThreadSearch}
              onScrollBottom={fetchMoreThreads}
              currentUser={currentUser}
              threadsPending={threadsPending}
              threads={threads}
              onCloseURL={onCloseURL}
              onFocus={() => this.setPeopleSelectorOpen(false)}
              threadSearch={threadSearch}
            />
            <Route path='/messages/:messageThreadId' exact>
              {({ match }) => (

                <CSSTransition
                  in={match != null}
                  appear
                  classNames='right-column'
                  timeout={{ appear: 300, enter: 300, exit: 200 }}
                  unmountOnExit
                >
                  <div styleName='right-column'>
                    <div styleName='thread'>
                      {forNewThread &&
                        <div>
                          <div styleName='new-thread-header'>
                            <Link to='/messages' styleName='back-button'>
                              <Icon name='ArrowForward' styleName='close-messages-icon' />
                            </Link>
                            <div styleName='messages-title'>
                              <Icon name='Messages' />
                              <h3>New Message</h3>
                            </div>
                          </div>
                          <PeopleSelector
                            currentUser={currentUser}
                            fetchPeople={fetchPeople}
                            fetchDefaultList={fetchRecentContacts}
                            focusMessage={this.focusForm}
                            setPeopleSearch={setContactsSearch}
                            people={contacts}
                            onCloseURL={onCloseURL}
                            onFocus={() => this.setPeopleSelectorOpen(true)}
                            selectedPeople={participants}
                            selectPerson={this.addParticipant}
                            removePerson={this.removeParticipant}
                            peopleSelectorOpen={peopleSelectorOpen}
                          />
                        </div>}
                      {!forNewThread && messageThreadId &&
                        <Header
                          messageThread={messageThread}
                          currentUser={currentUser}
                          pending={messagesPending}
                          onCloseURL={onCloseURL}
                        />}
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
                            onFocus={() => this.setPeopleSelectorOpen(false)}
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
                </CSSTransition>
              )}
            </Route>
          </React.Fragment>
        }
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
  contacts: PropTypes.array,
  location: PropTypes.object,
  messageCreatePending: PropTypes.bool,
  messageText: PropTypes.string,
  messageThread: PropTypes.object,
  messageThreadId: PropTypes.string,
  messageThreadPending: PropTypes.bool,
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
