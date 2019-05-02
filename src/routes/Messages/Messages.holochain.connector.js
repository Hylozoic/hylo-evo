import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { graphql, compose } from 'react-apollo'
import { get } from 'lodash/fp'
import { getSocket, sendIsTyping } from 'client/websockets'
import { push } from 'connected-react-router'
import { threadUrl } from 'util/navigation'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getMe from 'store/selectors/getMe'
import { FetchThreadsQuery } from 'store/actions/fetchThreads'
import PeopleQuery from 'graphql/queries/PeopleQuery.graphql'
import HolochainPeopleQuery from 'graphql/queries/HolochainPeopleQuery.graphql'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import {
  updateMessageText,
  setThreadSearch,
  setContactsSearch,
  getTextForCurrentMessageThread,
  getThreadSearch,
  CreateMessageMutation,
  FetchMessagesQuery,
  FindOrCreateThreadMutation,
  FetchThreadQuery,
  getContactsSearch
} from './Messages.store'
import { NEW_THREAD_ID } from './Messages';

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
    socket: holochainActive ? mockSocket : getSocket()
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

const findOrCreateThread = graphql(FindOrCreateThreadMutation, {
  // mutation FindOrCreateThreadMutation ($participantIds: [String])
  options: {
    context: { holochain: true }
  },
  props: ({ mutate }) => ({
    findOrCreateThread: (participantIds, createdAt) => mutate({
      variables: {
        participantIds,
        createdAt
      }
    })
  })
})

const createMessage = graphql(CreateMessageMutation, {
  props: ({ mutate, loading }) => ({
    // $messageThreadId: String, $text: String, $createdAt: String
    createMessage: (messageThreadId, text, forNewThread) => mutate({
      variables: {
        messageThreadId,
        text,
        createdAt: new Date().getTime().toString()
      }
    }),
    messageCreatePending: loading
  }),
  options: {
    context: { holochain: true }
  }
})

const fetchThreads = graphql(FetchThreadsQuery, {
  // query ($first: Int, $offset: Int)
  props: ({ data }) => ({
    fetchThreads: () => {
      console.log('!!!', data)
    },
    threads: get('me.messageThreads.items', data),
    threadsPending: data.loading
  }),
  options: {
    context: { holochain: true }
  }
})

const fetchThread = graphql(FetchThreadQuery, {
  // query FetchThreadQuery ($id: ID)
  props: ({ data: { messageThread, loading } }) => ({
    fetchThread: () => {},
    messageThread,
    threadsPending: loading
  }),
  options: props => ({
    skip: !props.messageThreadId || props.messageThreadId === NEW_THREAD_ID,
    context: { holochain: true },
    variables: {
      // NOTE: it might be too much magic but if we changed
      // the query variable name to messageThreadId (which I think it shoul be)
      // then we can do away with this block as Apollo will by default look
      // for matching props on the component for missing variables.
      id: props.messageThreadId
    }
  })
})

const fetchMessages = graphql(FetchMessagesQuery, {
  // query ($id: ID, $cursor: ID)
  props: ({ data: { messageThread, loading } }) => ({
    fetchMessages: () => {},
    messages: get('messages.items', messageThread) || [],
    messagesPending: loading
  }),
  options: props => ({
    context: { holochain: true },
    variables: {
      id: props.messageThreadId
    }
  })
})

const fetchPeople = graphql(PeopleQuery, {
  // query PeopleQuery ($autocomplete: String, $first: Int)
  props: ({ data: { messageThread, loading } }) => ({
    fetchPeople: () => {}
  }),
  options: props => ({
    context: { holochain: true },
    variables: {
      autocomplete: props.contactsSearch
    }
  })
})

const holochainContacts = graphql(HolochainPeopleQuery, {
  options: {
    context: { holochain: true }
  },
  props: ({ data: { people } }) => {
    return {
      holochainContacts: get('items', people)
    }
  }
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  findOrCreateThread,
  createMessage,
  fetchThreads,
  fetchThread,
  fetchMessages,
  fetchPeople,
  holochainContacts
)
