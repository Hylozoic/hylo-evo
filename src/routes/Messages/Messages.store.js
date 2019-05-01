import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import gql from 'graphql-tag'
import { some, get, isEmpty, includes, pick, uniqueId } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-utils/constants'
import {
  FETCH_MESSAGES,
  FETCH_THREAD,
  FETCH_THREADS,
  UPDATE_THREAD_READ_TIME,
  CREATE_MESSAGE,
  CREATE_MESSAGE_PENDING,
  FIND_OR_CREATE_THREAD
} from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { NEW_THREAD_ID } from './Messages'

export const MODULE_NAME = 'Messages'
export const UPDATE_MESSAGE_TEXT = `${MODULE_NAME}/UPDATE_MESSAGE_TEXT`
export const SET_THREAD_SEARCH = `${MODULE_NAME}/SET_THREAD_SEARCH`
export const SET_CONTACTS_SEARCH = `${MODULE_NAME}/SET_CONTACTS_SEARCH`

export function setContactsSearch (search) {
  return {
    type: SET_CONTACTS_SEARCH,
    payload: search
  }
}

export function setThreadSearch (threadSearch) {
  return {
    type: SET_THREAD_SEARCH,
    payload: threadSearch
  }
}

export function updateMessageText (messageThreadId, messageText) {
  return {
    type: UPDATE_MESSAGE_TEXT,
    meta: {
      messageThreadId,
      messageText
    }
  }
}

// REDUCER

const defaultState = {
  contactsSearch: '',
  threadSearch: ''
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload, meta } = action
  if (error) return state

  switch (type) {
    case SET_CONTACTS_SEARCH:
      return { ...state, contactsSearch: payload }
    case SET_THREAD_SEARCH:
      return { ...state, threadSearch: payload }
    case CREATE_MESSAGE_PENDING:
      const messageThreadId = meta.forNewThread ? NEW_THREAD_ID : meta.messageThreadId
      return { ...state, [messageThreadId]: '' }
    case UPDATE_MESSAGE_TEXT:
      return { ...state, [meta.messageThreadId]: meta.messageText }
    default:
      return state
  }
}

// SELECTORS

export const moduleSelector = state => state[MODULE_NAME]

// Contacts and Participants

export function presentPersonListItem (person) {
  return {
    ...pick([ 'id', 'name', 'avatarUrl' ], person.ref),
    community: person.memberships.first()
      ? person.memberships.first().community.name : null
  }
}

const nameSort = (a, b) => {
  const aName = a.name.toUpperCase()
  const bName = b.name.toUpperCase()
  return aName > bName ? 1 : aName < bName ? -1 : 0
}

// TODO this can cleaned-up / seperated better
export const getHolochainContactsWithSearch = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => p => {
    const { contactsSearch } = state[MODULE_NAME]
    const holoFilter = props.holochainActive ? p.isHoloData : true
    if (!contactsSearch || contactsSearch.length < 1) return holoFilter
    return holoFilter && p.name.toLowerCase().includes(contactsSearch.toLowerCase())
  },
  (session, search = () => true) => {
    return session.Person
      .all()
      .filter(search)
      .toModelArray()
      .map(presentPersonListItem)
      .sort(nameSort)
  }
)

export const getRecentContacts = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
    return session.PersonConnection
      .all()
      .toModelArray()
      .map(connection => presentPersonListItem(connection.person))
      .sort(nameSort)
  }
)

// Threads and Messages

export const getCurrentMessageThreadId = (_, { match }) => match.params.messageThreadId

export const getTextForCurrentMessageThread = createSelector(
  moduleSelector,
  getCurrentMessageThreadId,
  (state, messageThreadId) => state[messageThreadId] || ''
)

export const getCurrentMessageThread = ormCreateSelector(
  orm,
  state => state.orm,
  getCurrentMessageThreadId,
  (session, messageThreadId) => {
    var thread
    try {
      thread = session.MessageThread.get({ id: messageThreadId })
    } catch (e) {
      return null
    }
    return {
      ...thread.ref,
      participants: thread.participants.toModelArray()
    }
  }
)

export const getThreadSearch = createSelector(
  moduleSelector,
  (state, props) => get('threadSearch', state)
)

export const getThreadResults = makeGetQueryResults(FETCH_THREADS)

export const getThreadsHasMore = createSelector(getThreadResults, get('hasMore'))

export const getThreads = ormCreateSelector(
  orm,
  state => state.orm,
  getThreadSearch,
  getThreadResults,
  (session, threadSearch, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.MessageThread.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => -new Date(x.updatedAt))
      .toModelArray()
      .filter(filterThreadsByParticipant(threadSearch))
  }
)

export function filterThreadsByParticipant (threadSearch) {
  if (!threadSearch) return () => true

  const threadSearchLC = threadSearch.toLowerCase()
  return thread => {
    const participants = thread.participants.toRefArray()
    const match = name => name.toLowerCase().startsWith(threadSearchLC)
    return some(p => some(match, p.name.split(' ')), participants)
  }
}

export const getMessages = createSelector(
  state => orm.session(state.orm),
  getCurrentMessageThreadId,
  (session, messageThreadId) => {
    let messageThread
    try {
      messageThread = session.MessageThread.get({ id: messageThreadId })
    } catch (e) {
      return []
    }
    return messageThread.messages.orderBy(c => Number(c.id)).toModelArray()
  }
)

const getMessageResults = makeGetQueryResults(FETCH_MESSAGES)

export const getMessagesHasMore = createSelector(
  getMessageResults,
  get('hasMore')
)

// ACTIONS (to be moved to /store/actions/*)

const FindOrCreateThreadMutation = gql`
  mutation FindOrCreateThreadMutation ($participantIds: [String]) {
    findOrCreateThread(data: {participantIds: $participantIds}) {
      id
      createdAt
      updatedAt
      participants {
        id
        name
        avatarUrl
      }
    }
  }
`
export function findOrCreateThread (participantIds, createdAt, holochainAPI = false, query = FindOrCreateThreadMutation) {
  return {
    type: FIND_OR_CREATE_THREAD,
    graphql: {
      query,
      variables: {
        participantIds,
        createdAt
      }
    },
    meta: {
      holochainAPI,
      extractModel: 'MessageThread'
    }
  }
}

export const FetchThreadQuery = gql`
  query FetchThreadQuery ($id: ID) {
    messageThread (id: $id) {
      id
      unreadCount
      lastReadAt
      createdAt
      updatedAt
      participants {
        id
        name
        avatarUrl
      }
      messages(first: 40, order: "desc") {
        items {
          id
          text
          creator {
            id
            name
            avatarUrl
          }
          createdAt
        }
        total
        hasMore
      }
    }
  }
`
export function fetchThread (id, holochainAPI = false, query = FetchThreadQuery) {
  return {
    type: FETCH_THREAD,
    graphql: {
      query: FetchThreadQuery,
      variables: {
        id
      }
    },
    meta: {
      holochainAPI,
      extractModel: 'MessageThread',
      extractQueryResults: {
        getType: () => FETCH_MESSAGES,
        getItems: get('payload.data.messageThread.messages')
      }
    }
  }
}

export const FetchMessagesQuery = gql`
  query ($id: ID, $cursor: ID) {
    messageThread (id: $id) {
      id
      messages(first: 80, cursor: $cursor, order: "desc") {
        items {
          id
          createdAt
          text
          creator {
            id
            name
            avatarUrl
          }
        }
        total
        hasMore
      }
    }
  }
`
export function fetchMessages (id, opts = {}, holochainAPI = false, query = FetchMessagesQuery) {
  return {
    type: FETCH_MESSAGES,
    graphql: {
      query,
      variables: opts.cursor ? { id, cursor: opts.cursor } : { id }
    },
    meta: {
      holochainAPI,
      extractModel: 'MessageThread',
      extractQueryResults: {
        getItems: get('payload.data.messageThread.messages')
      },
      id
    }
  }
}

export const CreateMessageMutation = gql`
  mutation ($messageThreadId: String, $text: String, $createdAt: String) {
    createMessage(data: {messageThreadId: $messageThreadId, text: $text, createdAt: $createdAt}) {
      id
      text
      createdAt
      creator {
        id
      }
      messageThread {
        id
      }
    }
  }
`
export function createMessage (messageThreadId, messageText, forNewThread, holochainAPI = false, query = CreateMessageMutation) {
  const createdAt = new Date().getTime().toString()
  return {
    type: CREATE_MESSAGE,
    graphql: {
      query,
      variables: {
        messageThreadId,
        text: messageText,
        createdAt
      }
    },
    meta: {
      holochainAPI,
      optimistic: true,
      extractModel: 'Message',
      tempId: uniqueId(`messageThread${messageThreadId}_`),
      messageThreadId,
      messageText,
      forNewThread,
      analytics: AnalyticsEvents.DIRECT_MESSAGE_SENT
    }
  }
}

export function updateThreadReadTime (id) {
  return {
    type: UPDATE_THREAD_READ_TIME,
    payload: { api: { path: `/noo/post/${id}/update-last-read`, method: 'POST' } },
    meta: { id }
  }
}
