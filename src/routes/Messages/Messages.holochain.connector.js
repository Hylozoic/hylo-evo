import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { graphql, compose } from 'react-apollo'
import { get } from 'lodash/fp'
import { getSocket, sendIsTyping } from 'client/websockets'
import { push } from 'connected-react-router'
import { threadUrl } from 'util/navigation'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getMe from 'store/selectors/getMe'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import { NEW_THREAD_ID } from './Messages'
import HolochainPeopleQuery from 'graphql/queries/HolochainPeopleQuery.graphql'
import FindOrCreateThreadMutation from 'graphql/mutations/FindOrCreateThreadMutation.graphql'
import CreateMessageMutation from 'graphql/mutations/CreateMessageMutation.graphql'
import MessageThreadsQuery from 'graphql/queries/MessageThreadsQuery.graphql'
import MessageThreadQuery from 'graphql/queries/MessageThreadQuery.graphql'
import MessageThreadMessagesQuery from 'graphql/queries/MessageThreadMessagesQuery.graphql'
import {
  updateMessageText,
  setThreadSearch,
  setContactsSearch,
  getTextForCurrentMessageThread,
  getThreadSearch,
  getContactsSearch,
  filterThreadsByParticipant
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
export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const messageThreadId = get('messageThreadId', routeParams)
  const { holochainActive } = props

  return {
    currentUser: getMe(state, props),
    onCloseURL: getPreviousLocation(state),
    messageThreadId,
    messageText: getTextForCurrentMessageThread(state, props),
    sendIsTyping: sendIsTyping(messageThreadId),
    threadSearch: getThreadSearch(state, props),
    contactsSearch: getContactsSearch(state, props),
    socket: holochainActive ? mockSocket : getSocket(),
    // The follow are not implemented as Apollo querybindings below
    // are doing each of these implicitly but they are still expected
    // at some places in components.
    //
    // Not implemented in holochain:
    fetchRecentContacts: () => {},
    updateThreadReadTime: () => {},
    // Apollo handled:
    fetchThreads: () => {},
    fetchThread: () => {},
    fetchMessages: () => {},
    fetchPeople: () => {}
  }
}

export function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setContactsSearch,
    setThreadSearch,
    updateMessageText,
    changeQuerystringParam,
    goToThread: messageThreadId => push(threadUrl(messageThreadId))
  }, dispatch)
}

/*
QUERIES, MUTATIONS, LOADING STATUS AND SELECTORS TO GO TO APOLLO
  x createMessage: mutation ($messageThreadId: String, $text: String, $createdAt: String)
  x fetchThreads: query ($first: Int, $offset: Int)
  !fetchMoreThreads: func,
  x fetchThread: query FetchThreadQuery ($id: ID)
  x fetchMessages: query ($id: ID, $cursor: ID)
  x fetchPeople: query PeopleQuery ($autocomplete: String, $first: Int)
  x findOrCreateThread: mutation FindOrCreateThreadMutation ($participantIds: [String])
  !updateThreadReadTime: func,
Selectors
  x threads: array,
  x messageThread: object,
  x messages: array,
  x holochainContacts: array,  // uses Redux store for contactsSearch within selector
Loading status
  x messagesPending: bool,
  x threadsPending: bool,
  x messageCreatePending: bool,
  !hasMoreMessages: bool
*/

export const holochainContacts = graphql(HolochainPeopleQuery, {
  props: ({ data: { people } }) => ({
    holochainContacts: get('items', people)
  })
})

export const findOrCreateThread = graphql(FindOrCreateThreadMutation, {
  props: ({ mutate }) => ({
    findOrCreateThread: (participantIds, createdAt) => mutate({
      variables: {
        participantIds,
        createdAt
      }
    })
  })
})

export const createMessage = graphql(CreateMessageMutation, {
  props: ({ mutate, loading }) => ({
    createMessage: (messageThreadId, text, forNewThread) => mutate({
      variables: {
        messageThreadId,
        text,
        createdAt: new Date().getTime().toString()
      },
      refetchQueries: [
        {
          query: MessageThreadQuery,
          variables: {
            id: messageThreadId
          }
        }
      ],
      messageCreatePending: loading
    })
  })
})

export const thread = graphql(MessageThreadQuery, {
  skip: props => !props.messageThreadId || props.messageThreadId === NEW_THREAD_ID,
  props: ({ data: { messageThread, loading } }) => ({
    messageThread,
    threadsPending: loading
  }),
  options: props => ({
    variables: {
      // NOTE: it might be too much magic but if we changed the query variable
      // name to messageThreadId (which I think it should be)
      // then we can do away with this block as Apollo will by default look
      // for matching props on the component for missing variables.
      id: props.messageThreadId
    }
  })
})

export const messages = graphql(MessageThreadMessagesQuery, {
  props: ({ data: { messageThread, loading } }) => ({
    messages: get('messages.items', messageThread) || [],
    messagesPending: loading
  }),
  options: props => ({
    variables: {
      id: props.messageThreadId
    }
  })
})

export const threads = graphql(MessageThreadsQuery, {
  props: ({ data: { me, loading }, threadSearch }) => {
    const threads = loading ? [] : get('messageThreads.items', me)
    return {
      threads: threads.filter(filterThreadsByParticipant(threadSearch)),
      threadsPending: loading
    }
  }
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  holochainContacts,
  findOrCreateThread,
  createMessage,
  thread,
  messages,
  threads
)
