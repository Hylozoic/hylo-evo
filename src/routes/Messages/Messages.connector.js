import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { get, isEmpty } from 'lodash/fp'
import { getSocket, sendIsTyping } from 'client/websockets'
import fetchThreads from 'store/actions/fetchThreads'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import getMe from 'store/selectors/getMe'
import {
  CREATE_MESSAGE,
  FIND_OR_CREATE_THREAD,
  FETCH_MESSAGES
} from 'store/constants'
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

// pending,
// forNewThread,
// onFocus,
// onBlur,
// updateMessageText,
// placeholder

export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const currentMessageThreadId = get('messageThreadId', routeParams)
  const currentMessageThread = getCurrentMessageThread(state, props)
  const forNewThread = currentMessageThreadId === 'new'

  return {
    onCloseURL: getPreviousLocation(state),
    forNewThread,
    /// Thread
    currentUser: getMe(state),
    currentMessageThreadId,
    currentMessageThread,
    /// Messages
    text: getTextForCurrentMessageThread(state, props),
    // TODO: messageCreatePending was pending for Messages
    messageCreatePending: !!state.pending[CREATE_MESSAGE] || (props.forNewThread && !!state.pending[FIND_OR_CREATE_THREAD]),
    sendIsTyping: sendIsTyping(currentMessageThreadId),
    /// ThreadList
    threadSearch: getThreadSearch(state, props),
    threads: getThreads(state, props),
    hasMoreThreads: getThreadsHasMore(state, props),
    /// MessageSection
    messages: getMessages(state, props),
    // TODO: messagesPending was pending for MessageSection
    messagesPending: !!state.pending[FETCH_MESSAGES],
    hasMoreMessages: getMessagesHasMore(state, { id: currentMessageThreadId }),
    socket: getSocket()
  }
}

/// Thread
export function mapDispatchToProps (dispatch, props) {
  const currentMessageThreadId = get('match.params.messageThreadId', props)
  const { holochainActive } = props

  return {
    ...bindActionCreators({
      /// MessageForm
      createMessage,
      updateMessageText,
      goToThread: messageThreadId => push(`/t/${messageThreadId}`), // TODO: ThreadUrl helper?
      /// ThreadList
      fetchThreads,
      setThreadSearch
    }, dispatch),
    // Thread
    fetchThread: () => dispatch(fetchThread(currentMessageThreadId, holochainActive)),
    // MessageSection
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

  // ThreadList
  const fetchThreads = () => dispatchProps.fetchThreads(20, 0, holochainActive)
  const fetchMoreThreads =
    hasMoreThreads
      ? () => dispatchProps.fetchThreads(20, threads.length)
      : () => {}
  // MessageSection
  const cursor = !isEmpty(messages) && messages[0].id

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    /// Messages
    createMessage: (messageThreadId, text, forNewThread) => createMessage(messageThreadId, text, forNewThread, holochainActive),
    // ThreadList
    fetchThreads,
    fetchMoreThreads,
    // MessageSection
    fetchMessages: fetchMessagesMaker(cursor)
  }
}

/// // Messages
// export default connect(mapStateToProps, mapDispatchToProps, mergeProps, {withRef: true})
// // MessageSection
// export default connect(mapStateToProps, mapDispatchToProps, mergeProps, {withRef: true})
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
