import { some, get, isEmpty, includes } from 'lodash/fp'
import orm from 'store/models'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { FETCH_THREADS } from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const MODULE_NAME = 'ThreadList'

export const SET_THREAD_SEARCH = `${MODULE_NAME}/SET_THREAD_SEARCH`

export function setThreadSearch (threadSearch) {
  return {
    type: SET_THREAD_SEARCH,
    payload: threadSearch
  }
}

export function fetchThreads (first = 10, offset = 0) {
  return {
    type: FETCH_THREADS,
    graphql: {
      query: `query ($first: Int, $offset: Int) {
        me {
          id
          messageThreads(sortBy: "updatedAt", order: "desc", first: $first, offset: $offset) {
            total
            hasMore
            items {
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
              messages(first: 1, order: "desc") {
                items {
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
          }
        }
      }`,
      variables: {
        first,
        offset
      }
    },
    meta: {
      extractModel: 'Me',
      extractQueryResults: {
        getItems: get('payload.data.me.messageThreads')
      }
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
    // .filter(x => includes(x.id))
    .orderBy(x => results.ids.indexOf(x.id))
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
