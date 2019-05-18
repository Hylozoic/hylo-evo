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
  getParticipantsFromQuerystring,
  getTextForCurrentMessageThread,
  getThreadSearch,
  getThreads,
  getThreadsHasMore,
  getMessages,
  getMessagesHasMore,
  getCurrentMessageThread,
  getRecentContacts
} from './Messages.store'

// TODO: Handle querystring participants for Members Message button
// Here is some of the stuff that was used to make it...
// participantIdsSearch: getQuerystringParam('participants', null, props),
// const { participantIdsSearch } = this.props
// if (participantIdsSearch) {
//   participantIdsSearch.forEach(p => this.addParticipant(p))
//   this.props.changeQuerystringParam(this.props, 'participants', null)
// }

export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const messageThreadId = get('messageThreadId', routeParams)
  const messageThread = getCurrentMessageThread(state, props)
  const recentContacts = getRecentContacts(state)

  return {
    recentContacts,
    participants: getParticipantsFromQuerystring(state, props),
    onCloseURL: getPreviousLocation(state),
    currentUser: getMe(state),
    messageThreadId,
    messageThread,
    messageText: getTextForCurrentMessageThread(state, props),
    messagesPending: isPendingFor(fetchMessages, state),
    messageCreatePending:
      isPendingFor(createMessage, state) ||
      isPendingFor(findOrCreateThread, state),
    threadsPending:
      isPendingFor(fetchThreads, state) ||
      isPendingFor(fetchMessages, state),
    threads: getThreads(state, props),
    hasMoreThreads: getThreadsHasMore(state, props),
    threadSearch: getThreadSearch(state, props),
    sendIsTyping: sendIsTyping(messageThreadId),
    messages: getMessages(state, props),
    hasMoreMessages: getMessagesHasMore(state, { id: messageThreadId }),
    socket: getSocket()
  }
}

export function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({
    setContactsSearch,
    setThreadSearch,
    updateMessageText,
    fetchThreads,
    fetchMessages,
    findOrCreateThread,
    createMessage,
    changeQuerystringParam,
    fetchRecentContacts,
    fetchPeople,
    updateThreadReadTime,
    fetchThread,
    goToThread: messageThreadId => push(threadUrl(messageThreadId))
  }, dispatch)
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { threads, messages, hasMoreThreads, messageThreadId } = stateProps
  const fetchThread = () => dispatchProps.fetchThread(messageThreadId)
  const fetchThreads = () => dispatchProps.fetchThreads(20, 0)
  const fetchMoreThreads =
    hasMoreThreads
      ? () => dispatchProps.fetchThreads(20, threads.length)
      : () => {}
  const fetchMessagesCursor = !isEmpty(messages) && messages[0].id
  const fetchMessages = () => dispatchProps.fetchMessages(messageThreadId, {
    cursor: fetchMessagesCursor
  })

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchThread,
    fetchThreads,
    fetchMoreThreads,
    fetchMessages
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
