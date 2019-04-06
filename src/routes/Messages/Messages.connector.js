import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get, isEmpty } from 'lodash/fp'
import { getSocket, sendIsTyping } from 'client/websockets'
import { push } from 'react-router-redux'
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

const mockSocket = { on: () => {}, off: () => {} }

export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const { holochainActive } = props
  const messageThreadId = get('messageThreadId', routeParams)
  const messageThread = getCurrentMessageThread(state, props)
  const forNewThread = messageThreadId === 'new'

  return {
    onCloseURL: getPreviousLocation(state),
    forNewThread,
    currentUser: getMe(state),
    messageThreadId,
    messageThread,
    messageText: getTextForCurrentMessageThread(state, props),
    messageCreatePending:
      isPendingFor(createMessage, state) ||
      (forNewThread && isPendingFor(findOrCreateThread, state)),
    sendIsTyping: sendIsTyping(messageThreadId),
    threadSearch: getThreadSearch(state, props),
    threads: getThreads(state, props),
    hasMoreThreads: getThreadsHasMore(state, props),
    messages: getMessages(state, props),
    messagesPending: isPendingFor(fetchMessages, state),
    hasMoreMessages: getMessagesHasMore(state, { id: messageThreadId }),
    socket: holochainActive ? mockSocket : getSocket()
  }
}

export function mapDispatchToProps (dispatch, props) {
  const messageThreadId = get('match.params.messageThreadId', props)
  const { holochainActive } = props

  return {
    ...bindActionCreators({
      updateMessageText,
      fetchThreads,
      setThreadSearch,
      goToThread: messageThreadId => push(threadUrl(messageThreadId))
    }, dispatch),
    findOrCreateThread: (participantIds, createdAt) =>
      dispatch(findOrCreateThread(participantIds, createdAt, holochainActive)),
    createMessage: (messageThreadId, text, forNewThread) =>
      dispatch(createMessage(messageThreadId, text, forNewThread, holochainActive)),
    fetchThread: () => dispatch(fetchThread(messageThreadId, holochainActive)),
    fetchMessagesMaker: cursor => () =>
      dispatch(fetchMessages(messageThreadId, {cursor}, holochainActive)),
    updateThreadReadTime: id => !holochainActive && dispatch(updateThreadReadTime(id)),
    reconnectFetchMessages: () => dispatch(fetchMessages(messageThreadId, {reset: true}))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { holochainActive } = ownProps
  const { fetchMessagesMaker } = dispatchProps
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
    fetchThreads,
    fetchMoreThreads,
    fetchMessages: fetchMessagesMaker(fetchMessagesCursor)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
