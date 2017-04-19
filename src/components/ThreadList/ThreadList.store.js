import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { FETCH_THREADS } from 'store/constants'

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

export const getThreads = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
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
  }
)
