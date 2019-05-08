import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { graphql, compose } from 'react-apollo'
import { get } from 'lodash/fp'
import { getSocket, sendIsTyping } from 'client/websockets'
import { push } from 'connected-react-router'
import { currentDateString } from 'util/holochain'
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

// Redux for local store, react-router/window location and socket stuff only

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
    // * Apollo + holochain query mocks
    // These functions in an Apollo world are either not called explicitely
    // and handled implicitely by the query bindings below or not implemented.
    // They are mocked here as this component is still expecting and calling
    // them in the case of it's redux use. This keeps us from needing to
    // pollute the component with null checks before calling each of these functions.
    fetchThreads: () => {},
    fetchThread: () => {},
    fetchMessages: () => {},
    fetchPeople: () => {},
    // Not implemented
    fetchRecentContacts: () => {},
    updateThreadReadTime: () => {}
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

// Apollo queries, selectors, mutations and loading status

export const findOrCreateThread = graphql(FindOrCreateThreadMutation, {
  props: ({ mutate }) => ({
    findOrCreateThread: participantIds => mutate({
      variables: {
        participantIds,
        createdAt: currentDateString()
      }
    })
  })
})

export const createMessage = graphql(CreateMessageMutation, {
  props: ({ mutate, loading }) => ({
    createMessage: (messageThreadId, text, forNewThread) => mutate({
      // TODO: Figure-out how to handle loading state for mutations
      // messageCreatePending: loading,
      variables: {
        messageThreadId,
        text,
        createdAt: currentDateString()
      },
      refetchQueries: [
        {
          query: MessageThreadsQuery,
          // * Best practice: Always pass variables that are arguments to the operation even if they are null.
          // If a query that has arguments is ran, even if those arguments are not provided
          // the query result is cache keyed with those variables in the header as null
          variables: {
            first: null,
            offset: null
          }
        }
      ]
    })
  })
})

export const holochainContacts = graphql(HolochainPeopleQuery, {
  props: ({ data: { people } }) => ({
    holochainContacts: get('items', people)
  })
})

export const threads = graphql(MessageThreadsQuery, {
  props: ({ data: { me, loading }, ownProps }) => {
    const threads = get('messageThreads.items', me)
    return {
      threads: threads && threads.filter(filterThreadsByParticipant(ownProps.threadSearch)),
      threadsPending: loading
    }
  },
  variables: {
    first: null,
    offset: null
  },
  options: {
    pollInterval: 60000
  }
})

export const thread = graphql(MessageThreadQuery, {
  skip: props => !props.messageThreadId || props.messageThreadId === NEW_THREAD_ID,
  props: ({ data: { messageThread, loading } }) => ({
    messageThread,
    messages: get('messages.items', messageThread),
    messagesPending: loading
  }),
  options: props => ({
    pollInterval: 10000,
    variables: {
      // * Best Practice: Normalize argument names in graphql queries (to explicit ID names)?
      // It may be too much magic but if we changed the query variable
      // name to messageThreadId (which I think it should be either way)
      // then we can do away with this block as Apollo will by default look
      // for matching props on the component for missing variables.
      id: props.messageThreadId
    }
  })
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  findOrCreateThread,
  createMessage,
  threads,
  thread,
  holochainContacts
)
