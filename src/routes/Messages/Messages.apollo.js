import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { graphql, compose } from 'react-apollo'
import { get } from 'lodash/fp'
import { getSocket, sendIsTyping } from 'client/websockets'
import { push } from 'connected-react-router'
import { threadUrl } from 'util/navigation'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import fetchThreads from 'store/actions/fetchThreads'
import fetchPeople from 'store/actions/fetchPeople'
import fetchRecentContacts from 'store/actions/fetchRecentContacts'
import HolochainPeopleQuery from 'graphql/queries/HolochainPeopleQuery.graphql'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import getMe from 'store/selectors/getMe'
import {
  updateMessageText,
  setThreadSearch,
  setContactsSearch,
  getTextForCurrentMessageThread,
  getThreadSearch
} from './Messages.store'

const mockSocket = { on: () => {}, off: () => {} }

/*
Redux for the local store, react-router and socket stuff only:

LOCAL STORE QUERIES, MUTATIONS
  setContactsSearch: func,
  setThreadSearch: func,
  updateMessageText: func,
  messageText: string,
  threadSearch: string,

SOCKETS RELATED
  sendIsTyping: func,
  socket: object,

REACT ROUTER/WINDOW LOCATION BASED
  messageThreadId: string,
  onCloseURL: string,
  !location: object,
  goToThread: func,
  changeQuerystringParam: func,
*/
export function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setContactsSearch,
    setThreadSearch,
    updateMessageText,
    changeQuerystringParam,
    goToThread: messageThreadId => push(threadUrl(messageThreadId))
  }, dispatch)
}
export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const messageThreadId = get('messageThreadId', routeParams)
  const { holochainActive } = props

  return {
    onCloseURL: getPreviousLocation(state),
    messageThreadId,
    messageText: getTextForCurrentMessageThread(state, props),
    sendIsTyping: sendIsTyping(messageThreadId),
    threadSearch: getThreadSearch(state, props),
    socket: holochainActive ? mockSocket : getSocket()
  }
}

/*
QUERIES, MUTATIONS, LOADING STATUS AND SELECTORS TO GO TO APOLLO
  fetchForCurrentUser: user,
  createMessage: func,
  fetchThreads: func,
  fetchMoreThreads: func,
  fetchThread: func,
  fetchMessages: func,
  fetchPeople: func,
  findOrCreateThread: func,
  updateThreadReadTime: func,
Selectors
  currentUser: object,
  threads: array,
  messages: array,
  messageThread: object,
  holochainContacts: array,  // uses Redux store for contactsSearch within selector
  recentContacts: array,
  participants: array,
Loading status
  threadsPending: bool,
  messagesPending: bool,
  messageCreatePending: bool,
  hasMoreMessages: bool,
*/
const holochainContacts = graphql(HolochainPeopleQuery, {
  options: {
    context: { holochain: true },
    pollInterval: 10000
  },
  props: ({ data: { people } }) => {
    return {
      holochainContacts: people && people.items
    }
  }
})

export default compose(
  holochainContacts,
  connect(mapStateToProps, mapDispatchToProps)
)
