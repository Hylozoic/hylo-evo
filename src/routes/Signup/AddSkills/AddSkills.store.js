import { createSelector } from 'redux-orm'
import orm from 'store/models'

export const SIGNUP_ADD_SKILL = `SIGNUP_SIGNUP_ADD_SKILL`
export const FETCH_MY_SKILLS = `FETCH_MY_SKILLS`
export const REMOVE_SKILL = `REMOVE_SKILL`

export function addSkill (skillName) {
  return {
    type: SIGNUP_ADD_SKILL,
    graphql: {
      query: `mutation ($name: String) {
        addSkill(name: $name) {
          id,
          name
        }
      }`,
      variables: {
        name: skillName
      }
    },
    meta: {
      optimistic: true,
      skillName
    }
  }
}

export function removeSkill (skillId) {
  return {
    type: REMOVE_SKILL,
    graphql: {
      query: `mutation ($id: ID) {
        removeSkill(id: $id) {
          success
        }
      }`,
      variables: {
        id: skillId
      }
    },
    meta: {
      optimistic: true,
      skillId
    }
  }
}

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
    console.log('getMySkills')
    const me = session.Me.first()
    if (!me) return []
    return me.skills.toRefArray()
  }
)
