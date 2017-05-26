import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import orm from 'store/models'
import {
  FETCH_MESSAGES,
  UPDATE_THREAD_READ_TIME
} from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export function fetchMessages (id, opts = {}) {
  return {
    type: FETCH_MESSAGES,
    graphql: {
      query: `
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
      `,
      variables: opts.cursor ? {id, cursor: opts.cursor} : {id}
    },
    meta: {
      extractModel: 'MessageThread',
      reset: opts.reset,
      id
    }
  }
}

export function updateThreadReadTime (id) {
  return {
    type: UPDATE_THREAD_READ_TIME,
    payload: {api: {path: `/noo/post/${id}/update-last-read`, method: 'POST'}},
    meta: {id}
  }
}

export const getMessages = createSelector(
  state => orm.session(state.orm),
  (state, props) => props.messageThreadId,
  (session, id) => {
    let messageThread
    try {
      messageThread = session.MessageThread.get({id})
    } catch (e) {
      return []
    }
    return messageThread.messages.orderBy(c => Number(c.id)).toModelArray()
  })

const getMessageResults = makeGetQueryResults(FETCH_MESSAGES)

export const getHasMoreMessages = createSelector(
  getMessageResults,
  get('hasMore')
)

export const getTotalMessages = createSelector(
  getMessageResults,
  get('total')
)
