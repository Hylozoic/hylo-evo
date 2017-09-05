import { createSelector } from 'redux-orm'
import orm from 'store/models'

export const FETCH_MY_SKILLS = `FETCH_MY_SKILLS`
export const UPDATE_USER_SETTINGS = `UPDATE_USER_SETTINGS`

export function fetchMySkills (limit = 20) {
  return {
    type: FETCH_MY_SKILLS,
    graphql: {
      query: `query ($limit: Int) {
        me {
          id
          skills (first: $limit) {
            items {
              id
              name
            }
          }
        }
      }`,
      variables: { limit }
    },
    meta: {
      extractModel: 'Me'
    }
  }
}

export const getMySkills = createSelector(
  orm,
  state => state.orm,
  (session) => {
    const me = session.Me.first()
    if (!me) return []
    return me.skills.toRefArray()
  }
)
