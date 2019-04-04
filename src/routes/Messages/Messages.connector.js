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
  getTextForMessageThread,
  getThreadSearch,
  getThreads,
  getThreadsHasMore,
  getMessages,
  getMessagesHasMore,
  getTotalMessages,
  getCurrentThread
} from './Messages.store'

findOrCreateThread,
goToThread,
pending,
forNewThread,
onFocus,
onBlur,
updateMessageText,
placeholder


export function mapStateToProps (state, props) {
  const currentThreadId = get('match.params.threadId', props)

  return {
    onCloseURL: getPreviousLocation(state),
    /// Thread
    currentUser: getMe(state),
    currentThreadId,
    currentThread: getCurrentThread(state, props),
    /// Messages
    text: getTextForMessageThread(state, props),
    // TODO: messageCreatePending was pending for Messages
    messageCreatePending: !!state.pending[CREATE_MESSAGE] || (props.forNewThread && !!state.pending[FIND_OR_CREATE_THREAD]),
    sendIsTyping: sendIsTyping(currentThreadId),
    /// ThreadList
    threadSearch: getThreadSearch(state, props),
    threads: getThreads(state, props),
    hasMoreThreads: getThreadsHasMore(state, props),
    /// MessageSection
    messages: getMessages(state, props),
    // TODO: messagesPending was pending for MessageSection
    messagesPending: !!state.pending[FETCH_MESSAGES],
    totalMessages: getTotalMessages(state, { id: currentThreadId }),
    // TODO: hasMoreMessages is hasMore prop MessageSection
    hasMoreMessages: getMessagesHasMore(state, { id: currentThreadId }),
    socket: getSocket()
  }
}

/// Thread
export function mapDispatchToProps (dispatch, props) {
  const currentThreadId = get('match.params.threadId', props)
  const { holoMode } = props

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
    fetchThread: () => dispatch(fetchThread(currentThreadId, holoMode)),
    // MessageSection
    fetchMessagesMaker: cursor => () => dispatch(fetchMessages(currentThreadId, {cursor}, holoMode)),
    updateThreadReadTime: id => dispatch(updateThreadReadTime(id)),
    reconnectFetchMessages: () => dispatch(fetchMessages(currentThreadId, {reset: true})),
    findOrCreateThread: (participantIds, createdAt) => dispatch(findOrCreateThread(participantIds, createdAt, holoMode))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { holoMode } = ownProps
  const { createMessage, fetchMessagesMaker } = dispatchProps
  const { threads, messages, hasMoreThreads } = stateProps

  // ThreadList
  const fetchThreads = () => dispatchProps.fetchThreads(20, 0, holoMode)
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
    createMessage: (messageThreadId, text, forNewThread) => createMessage(messageThreadId, text, forNewThread, holoMode),
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


//// MESSAGES
// text
// pending
// currentUser
// sendIsTyping
// createMessage
// updateMessageText
// goToThread

// /// Thread
// currentUser
// currentThread
// id (currentThread)
// fetchThread
