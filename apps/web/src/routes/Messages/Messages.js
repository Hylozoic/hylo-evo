import React, { useState, useEffect, useRef } from 'react'
import { withTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
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
import classes from './Messages.module.scss'

export const NEW_THREAD_ID = 'new'

const Messages = (props) => {
  const {
    messageThreadId,
    participants: initialParticipants,
    prompt,
    fetchThreads,
    fetchPeople,
    changeQuerystringParam,
    createMessage,
    findOrCreateThread,
    goToThread,
    updateMessageText,
    t
  } = props

  // TODO: figure out what was coming from the routeProps, and use useParams for them instead

  const [forNewThread, setForNewThread] = useState(messageThreadId === NEW_THREAD_ID)
  const [loading, setLoading] = useState(true)
  const [peopleSelectorOpen, setPeopleSelectorOpen] = useState(false)
  const [onCloseLocation] = useState(props.onCloseLocation)
  const [participants, setParticipants] = useState([])

  const form = useRef(null)

  useEffect(() => {
    const init = async () => {
      await fetchThreads()
      await fetchPeople({})
      setLoading(false)
      onThreadIdChange()

      if (initialParticipants) {
        initialParticipants.forEach(p => addParticipant(p))
        changeQuerystringParam(props, 'participants', null)
      }

      if (prompt) {
        updateMessageText(prompt)
        changeQuerystringParam(props, 'prompt', null)
        focusForm()
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (messageThreadId && messageThreadId !== props.messageThreadId) {
      onThreadIdChange()
    }
  }, [messageThreadId])

  const onThreadIdChange = () => {
    const newForNewThread = messageThreadId === NEW_THREAD_ID
    setForNewThread(newForNewThread)
    if (!newForNewThread) {
      props.fetchThread()
    }
    focusForm()
  }

  const sendMessage = () => {
    if (!props.messageText || props.pending) return false
    setParticipants([])
    if (forNewThread) {
      sendNewMessage()
    } else {
      sendForExisting()
    }
    return false
  }

  const sendForExisting = () => {
    createMessage(messageThreadId, TextHelpers.markdown(props.messageText)).then(() => focusForm())
  }

  const sendNewMessage = async () => {
    const participantIds = participants.map(p => p.id)
    const createThreadResponse = await findOrCreateThread(participantIds)
    const newMessageThreadId = get('payload.data.findOrCreateThread.id', createThreadResponse) ||
      get('data.findOrCreateThread.id', createThreadResponse)
    await createMessage(newMessageThreadId, TextHelpers.markdown(props.messageText), true)
    goToThread(newMessageThreadId)
  }

  const addParticipant = (participant) => {
    setParticipants(prevParticipants => [...prevParticipants, participant])
  }

  const removeParticipant = (participant) => {
    setParticipants(prevParticipants =>
      !participant
        ? prevParticipants.slice(0, prevParticipants.length - 1)
        : prevParticipants.filter(p => p.id !== participant.id)
    )
  }

  const focusForm = () => form.current && form.current.focus()

  return (
    <div className={cx(classes.modal, { [classes.messagesOpen]: messageThreadId })}>
      <Helmet>
        <title>Messages | Hylo</title>
      </Helmet>
      <div className={classes.content}>
        <div className={classes.messagesHeader}>
          <div className={classes.closeMessages}>
            <CloseMessages onCloseLocation={onCloseLocation} />
          </div>
          <div className={classes.messagesTitle}>
            <Icon name='Messages' />
            { !forNewThread
              ? <h3>{t('Messages')}</h3>
              : <h3>{t('New Message')}</h3>
            }
          </div>
        </div>
        {loading
          ? <div className={classes.modal}><Loading /></div>
          : <React.Fragment>
            <ThreadList
              className={classes.leftColumn}
              setThreadSearch={props.setThreadSearch}
              onScrollBottom={props.fetchMoreThreads}
              currentUser={props.currentUser}
              threadsPending={props.threadsPending}
              threads={props.threads}
              onFocus={() => setPeopleSelectorOpen(false)}
              threadSearch={props.threadSearch}
            />
            <Route path='/messages/:messageThreadId' element={
                <CSSTransition
                  // in={match != null}
                  appear
                  classNames='right-column'
                  timeout={{ appear: 300, enter: 300, exit: 200 }}
                  unmountOnExit
                >
                  <div className={classes.rightColumn}>
                    <div className={classes.thread}>
                      {forNewThread &&
                        <div>
                          <div className={classes.newThreadHeader}>
                            <Link to='/messages' className={classes.backButton}>
                              <Icon name='ArrowForward' className={classes.closeMessagesIcon} />
                            </Link>
                            <div className={classes.messagesTitle}>
                              <Icon name='Messages' />
                              <h3>{t('New Message')}</h3>
                            </div>
                          </div>
                          <PeopleSelector
                            currentUser={props.currentUser}
                            fetchPeople={props.fetchPeople}
                            fetchDefaultList={props.fetchRecentContacts}
                            focusMessage={focusForm}
                            setPeopleSearch={props.setContactsSearch}
                            people={props.contacts}
                            onFocus={() => setPeopleSelectorOpen(true)}
                            selectedPeople={participants}
                            selectPerson={addParticipant}
                            removePerson={removeParticipant}
                            peopleSelectorOpen={peopleSelectorOpen}
                          />
                        </div>}
                      {!forNewThread && messageThreadId &&
                        <Header
                          messageThread={props.messageThread}
                          currentUser={props.currentUser}
                          pending={props.messagesPending}
                        />}
                      {!forNewThread &&
                        <MessageSection
                          socket={props.socket}
                          currentUser={props.currentUser}
                          fetchMessages={props.fetchMessages}
                          messages={props.messages}
                          hasMore={props.hasMoreMessages}
                          pending={props.messagesPending}
                          updateThreadReadTime={props.updateThreadReadTime}
                          messageThread={props.messageThread} />}
                      {(!forNewThread || participants.length > 0) &&
                        <div className={classes.messageForm}>
                          <MessageForm
                            onSubmit={sendMessage}
                            onFocus={() => setPeopleSelectorOpen(false)}
                            currentUser={props.currentUser}
                            formRef={form}
                            updateMessageText={props.updateMessageText}
                            messageText={props.messageText}
                            sendIsTyping={props.sendIsTyping}
                            pending={props.messageCreatePending} />
                        </div>}
                      <PeopleTyping className={classes.peopleTyping} />
                      {props.socket && <SocketSubscriber type='post' id={messageThreadId} />}
                    </div>
                  </div>
                </CSSTransition>
              }
            />
          </React.Fragment>
        }
      </div>
    </div>
  )
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
  onCloseLocation: PropTypes.string,
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

export default withTranslation()(Messages)
