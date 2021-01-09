import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, some, isEmpty, castArray, includes, pick, uniqueId, sortBy } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-utils/constants'
import orm from 'store/models'
import { toRefArray } from 'util/reduxOrmMigration'
import {
  FETCH_MESSAGES,
  FETCH_THREAD,
  FETCH_THREADS,
  UPDATE_THREAD_READ_TIME,
  CREATE_MESSAGE,
  FIND_OR_CREATE_THREAD
} from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import FindOrCreateThreadMutation from 'graphql/mutations/FindOrCreateThreadMutation.graphql'
import CreateMessageMutation from 'graphql/mutations/CreateMessageMutation.graphql'
import MessageThreadQuery from 'graphql/queries/MessageThreadQuery.graphql'
import MessageThreadMessagesQuery from 'graphql/queries/MessageThreadMessagesQuery.graphql'
import getQuerystringParam from 'store/selectors/getQuerystringParam'

export const MODULE_NAME = 'Messages'
export const UPDATE_MESSAGE_TEXT = `${MODULE_NAME}/UPDATE_MESSAGE_TEXT`
export const SET_THREAD_SEARCH = `${MODULE_NAME}/SET_THREAD_SEARCH`
export const SET_CONTACTS_SEARCH = `${MODULE_NAME}/SET_CONTACTS_SEARCH`

// LOCAL STORE

// Actions

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

// Selectors

export const moduleSelector = state => state[MODULE_NAME]

export const getContactsSearch = createSelector(
  moduleSelector,
  (state, props) => state.contactsSearch
)

export const getThreadSearch = createSelector(
  moduleSelector,
  (state, props) => get('threadSearch', state)
)

// REDUCER

export const defaultState = {
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
    case UPDATE_MESSAGE_TEXT:
      return { ...state, [meta.messageThreadId]: meta.messageText }
    default:
      return state
  }
}

// GLOBAL STORE

// ACTIONS (to be moved to /store/actions/*)

export function findOrCreateThread (participantIds) {
  return {
    type: FIND_OR_CREATE_THREAD,
    graphql: {
      query: FindOrCreateThreadMutation,
      variables: {
        participantIds
      }
    },
    meta: {
      extractModel: 'MessageThread'
    }
  }
}

export function fetchThread (id) {
  return {
    type: FETCH_THREAD,
    graphql: {
      query: MessageThreadQuery,
      variables: {
        id
      }
    },
    meta: {
      extractModel: 'MessageThread',
      extractQueryResults: {
        getType: () => FETCH_MESSAGES,
        getItems: get('payload.data.messageThread.messages')
      }
    }
  }
}

export function fetchMessages (id, opts = {}) {
  return {
    type: FETCH_MESSAGES,
    graphql: {
      query: MessageThreadMessagesQuery,
      variables: opts.cursor ? { id, cursor: opts.cursor } : { id }
    },
    meta: {
      extractModel: 'MessageThread',
      extractQueryResults: {
        getItems: get('payload.data.messageThread.messages')
      },
      id
    }
  }
}

export function createMessage (messageThreadId, messageText, forNewThread) {
  return {
    type: CREATE_MESSAGE,
    graphql: {
      query: CreateMessageMutation,
      variables: {
        messageThreadId,
        text: messageText
      }
    },
    meta: {
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
    payload: {
      api: {
        path: `/noo/post/${id}/update-last-read`,
        method: 'POST'
      }
    },
    meta: { id }
  }
}

// Selectors

export const getParticipantsFromQuerystring = ormCreateSelector(
  orm,
  (_, props) => props,
  ({ Person }, props) => {
    const participantsQuerystringParam = getQuerystringParam('participants', null, props)
    if (!isEmpty(participantsQuerystringParam)) {
      const participantIds = participantsQuerystringParam.split(',')
      const participants = Person
        .all()
        .toRefArray()
        .filter(person => participantIds.includes(person.id))

      return participants
        ? castArray(participants)
        : null
    }

    return null
  }
)

export const getAllContacts = ormCreateSelector(
  orm,
  session => session.Person.all().toRefArray()
)

export const getRecentContacts = ormCreateSelector(
  orm,
  ({ PersonConnection }) => {
    const recentContacts = PersonConnection
      .all()
      .toModelArray()
      .map(connection => presentPersonListItem(connection.person))

    return sortByName(recentContacts)
  }
)

export const getMatchingContacts = ormCreateSelector(
  orm,
  getContactsSearch,
  ({ Person }, contactsSearch) => {
    if (!contactsSearch) return null
    const matchingContacts = Person
      .all()
      .toModelArray()
      .filter(person =>
        person.name.toLowerCase().includes(contactsSearch.toLowerCase())
      )
      .map(presentPersonListItem)

    return sortByName(matchingContacts)
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
  getCurrentMessageThreadId,
  (session, messageThreadId) => {
    const thread = session.MessageThread.withId(messageThreadId)
    if (!thread) return null
    return {
      ...thread.ref,
      participants: thread.participants.toModelArray()
    }
  }
)

export const getThreadResults = makeGetQueryResults(FETCH_THREADS)

export const getThreadsHasMore = createSelector(getThreadResults, get('hasMore'))

export const getThreads = ormCreateSelector(
  orm,
  getThreadSearch,
  getThreadResults,
  (session, threadSearch, searchResults) => {
    if (isEmpty(searchResults) || isEmpty(searchResults.ids)) return []
    return session.MessageThread.all()
      .orderBy(thread => -new Date(thread.updatedAt))
      .toModelArray()
      .filter(thread => includes(thread.id, searchResults.ids))
      .filter(filterThreadsByParticipant(threadSearch))
  }
)

export const getMessages = createSelector(
  state => orm.session(state.orm),
  getCurrentMessageThreadId,
  (session, messageThreadId) => {
    const messageThread = session.MessageThread.withId( messageThreadId )
    if (!messageThread) return []
    return messageThread.messages.orderBy(c => Number(c.id)).toModelArray()
  }
)

const getMessageResults = makeGetQueryResults(FETCH_MESSAGES)

export const getMessagesHasMore = createSelector(
  getMessageResults,
  get('hasMore')
)

// Utility

export function presentPersonListItem (person) {
  return {
    ...pick([ 'id', 'name', 'avatarUrl' ], person.ref),
    community: person.memberships.first()
      ? person.memberships.first().community.name : null
  }
}

export const sortByName = sortBy(person => person && person.name.toUpperCase())

export function filterThreadsByParticipant (threadSearch) {
  if (!threadSearch) return () => true

  const threadSearchLC = threadSearch.toLowerCase()
  return thread => {
    const participants = toRefArray(thread.participants)
    const match = name => name.toLowerCase().startsWith(threadSearchLC)
    return some(p => some(match, p.name.split(' ')), participants)
  }
}
