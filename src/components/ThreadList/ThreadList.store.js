import { some } from 'lodash/fp'
import orm from 'store/models'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { FETCH_THREADS } from 'store/constants'

export const MODULE_NAME = 'ThreadList'

export const SET_THREAD_SEARCH = 'SET_THREAD_SEARCH'

export function setThreadSearch (threadSearch) {
  return {
    type: SET_THREAD_SEARCH,
    payload: threadSearch
  }
}

export function fetchThreads () {
  return {
    type: FETCH_THREADS,
    graphql: {
      query: `{
        me {
          id
          messageThreads {
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
            messages(first: 1) {
              id
              createdAt
              text
              creator {
                id
                name
              }
            }
          }
        }
      }`
    }
  }
}

const defaultState = {
  threadSearch: ''
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_THREAD_SEARCH:
      return {threadSearch: payload}
    default:
      return state
  }
}

export const moduleSelector = (state) => {
  return state[MODULE_NAME]
}

export const getThreadSearch = createSelector(
  moduleSelector,
  (state, props) => state.threadSearch
)

export const getThreads = ormCreateSelector(
  orm,
  state => state.orm,
  getThreadSearch,
  (session, threadSearch) => {
    return session.MessageThread.all()
    .orderBy(x => -1 * new Date(x.updatedAt).getTime())
    .toModelArray()
    .map(thread => ({
      ...thread.ref,
      messages: thread.messages
        .orderBy(x => -1 * new Date(x.createdAt).getTime())
        .toModelArray(),
      participants: thread.participants.toModelArray()
    }))
    .filter(filterThreadsByParticipant(threadSearch))
  }
)

export function filterThreadsByParticipant (threadSearch) {
  const tlc = s => s.toLowerCase()
  const threadSearchTlc = tlc(threadSearch)
  return (thread) => {
    if (threadSearch === '') return true
    return some(p => some(name => tlc(name).startsWith(threadSearchTlc), p.name.split(' ')), thread.participants)
  }
}
