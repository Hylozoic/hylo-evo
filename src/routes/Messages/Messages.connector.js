import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { get, isEmpty } from 'lodash/fp'
import { getSocket, sendIsTyping } from 'client/websockets'
import { threadUrl } from 'util/navigation'
import fetchThreads from 'store/actions/fetchThreads'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import getMe from 'store/selectors/getMe'
import isPendingFor from 'store/selectors/isPendingFor'
import {
  createMessage,
  fetchMessages,
  fetchThread,
  findOrCreateThread,
  updateMessageText,
  updateThreadReadTime,
  setThreadSearch,
  getTextForCurrentMessageThread,
  getThreadSearch,
  getThreads,
  getThreadsHasMore,
  getMessages,
  getMessagesHasMore,
  getCurrentMessageThread
} from './Messages.store'

export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const currentMessageThreadId = get('messageThreadId', routeParams)
  const currentMessageThread = getCurrentMessageThread(state, props)
  const forNewThread = currentMessageThreadId === 'new'

  return {
    onCloseURL: getPreviousLocation(state),
    forNewThread,
    currentUser: getMe(state),
    currentMessageThreadId,
    currentMessageThread,
    // TODO: Handle this as controlled input in local state on MessageForm? Sockets?
    text: getTextForCurrentMessageThread(state, props),
    messageCreatePending:
      isPendingFor(createMessage, state) ||
      (forNewThread && isPendingFor(findOrCreateThread, state)),
    sendIsTyping: sendIsTyping(currentMessageThreadId),
    threadSearch: getThreadSearch(state, props),
    threads: getThreads(state, props),
    hasMoreThreads: getThreadsHasMore(state, props),
    messages: getMessages(state, props),
    messagesPending: isPendingFor(fetchMessages, state),
    hasMoreMessages: getMessagesHasMore(state, { id: currentMessageThreadId }),
    socket: getSocket()
  }
}

export function mapDispatchToProps (dispatch, props) {
  const currentMessageThreadId = get('match.params.messageThreadId', props)
  const { holochainActive } = props

  return {
    ...bindActionCreators({
      createMessage,
      // TODO: Handle this as controlled input in local state on MessageForm? Sockets?
      updateMessageText,
      goToThread: messageThreadId => push(threadUrl(messageThreadId)),
      fetchThreads,
      setThreadSearch
    }, dispatch),
    fetchThread: () => dispatch(fetchThread(currentMessageThreadId, holochainActive)),
    fetchMessagesMaker: cursor => () => dispatch(fetchMessages(currentMessageThreadId, {cursor}, holochainActive)),
    updateThreadReadTime: id => dispatch(updateThreadReadTime(id)),
    reconnectFetchMessages: () => dispatch(fetchMessages(currentMessageThreadId, {reset: true})),
    findOrCreateThread: (participantIds, createdAt) => dispatch(findOrCreateThread(participantIds, createdAt, holochainActive))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { holochainActive } = ownProps
  const { createMessage, fetchMessagesMaker } = dispatchProps
  const { threads, messages, hasMoreThreads } = stateProps

  const fetchThreads = () => dispatchProps.fetchThreads(20, 0, holochainActive)
  const fetchMoreThreads =
    hasMoreThreads
      ? () => dispatchProps.fetchThreads(20, threads.length)
      : () => {}
  const fetchMessagesCursor = !isEmpty(messages) && messages[0].id

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    createMessage: (messageThreadId, text, forNewThread) => createMessage(messageThreadId, text, forNewThread, holochainActive),
    fetchThreads,
    fetchMoreThreads,
    fetchMessages: fetchMessagesMaker(fetchMessagesCursor)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)

/// MESSAGES
// text
// pending
// currentUser
// sendIsTyping
// createMessage
// updateMessageText
// goToThread

// /// Thread
// currentUser
// currentMessageThread
// id (currentMessageThread)
// fetchThread
