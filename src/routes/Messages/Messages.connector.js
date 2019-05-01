import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get, isEmpty } from 'lodash/fp'
import { getSocket, sendIsTyping } from 'client/websockets'
import { push } from 'connected-react-router'
import { threadUrl } from 'util/navigation'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import isPendingFor from 'store/selectors/isPendingFor'
import fetchThreads from 'store/actions/fetchThreads'
import fetchPeople from 'store/actions/fetchPeople'
import fetchRecentContacts from 'store/actions/fetchRecentContacts'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import getMe from 'store/selectors/getMe'
import {
  createMessage,
  fetchMessages,
  fetchThread,
  findOrCreateThread,
  updateMessageText,
  updateThreadReadTime,
  setThreadSearch,
  setContactsSearch,
  getHolochainContactsWithSearch,
  getTextForCurrentMessageThread,
  getThreadSearch,
  getThreads,
  getThreadsHasMore,
  getMessages,
  getMessagesHasMore,
  getCurrentMessageThread,
  getRecentContacts
} from './Messages.store'

export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const { holochainActive } = props
  const messageThreadId = get('messageThreadId', routeParams)
  const messageThread = getCurrentMessageThread(state, props)
  const recentContacts = holochainActive ? [] : getRecentContacts(state)

  return {
    recentContacts,
    holochainContacts: getHolochainContactsWithSearch(state, props),
    onCloseURL: getPreviousLocation(state),
    currentUser: getMe(state),
    messageThreadId,
    messageThread,
    messageText: getTextForCurrentMessageThread(state, props),
    messageCreatePending:
      isPendingFor(createMessage, state) ||
      isPendingFor(findOrCreateThread, state),
    sendIsTyping: sendIsTyping(messageThreadId),
    threadSearch: getThreadSearch(state, props),
    threads: getThreads(state, props),
    threadsPending: isPendingFor(fetchThreads, state),
    hasMoreThreads: getThreadsHasMore(state, props),
    messages: getMessages(state, props),
    messagesPending: isPendingFor(fetchMessages, state),
    hasMoreMessages: getMessagesHasMore(state, { id: messageThreadId }),
    socket: holochainActive ? null : getSocket()
  }
}

export function mapDispatchToProps (dispatch, props) {
  const messageThreadId = get('match.params.messageThreadId', props)
  const { holochainActive } = props

  return {
    ...bindActionCreators({
      setContactsSearch,
      setThreadSearch,
      updateMessageText,
      fetchThreads,
      fetchMessages,
      findOrCreateThread,
      changeQuerystringParam,
      fetchRecentContacts,
      goToThread: messageThreadId => push(threadUrl(messageThreadId))
    }, dispatch),
    fetchPeople: (autocomplete, query, first) =>
      dispatch(fetchPeople(autocomplete, query, first, holochainActive)),
    createMessage: (messageThreadId, text, forNewThread) =>
      dispatch(createMessage(messageThreadId, text, forNewThread, holochainActive)),
    fetchThread: () => dispatch(fetchThread(messageThreadId, holochainActive)),
    updateThreadReadTime: id => !holochainActive && dispatch(updateThreadReadTime(id))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { holochainActive } = ownProps
  const { threads, messages, hasMoreThreads, messageThreadId } = stateProps
  const findOrCreateThread = (participantIds, createdAt) =>
    dispatchProps.findOrCreateThread(participantIds, createdAt, holochainActive)
  const fetchThreads = () => dispatchProps.fetchThreads(20, 0, holochainActive)
  const fetchMoreThreads =
    hasMoreThreads
      ? () => dispatchProps.fetchThreads(20, threads.length)
      : () => {}
  const fetchMessagesCursor = !isEmpty(messages) && messages[0].id
  const fetchMessages = () => dispatchProps.fetchMessages(messageThreadId, {
    cursor: fetchMessagesCursor
  }, holochainActive)

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    findOrCreateThread,
    fetchThreads,
    fetchMoreThreads,
    fetchMessages
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
