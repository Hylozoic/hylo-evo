import { createSelector } from 'redux-orm'
import orm from 'store/models'

export const ADD_SKILL = `ADD_SKILL`
export const FETCH_MEMBER_SKILLS = `FETCH_MEMBER_SKILLS`

export function addSkill (skillName) {
  return {
    type: ADD_SKILL,
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

export function fetchMemberSkills (id, limit = 20) {
  return {
    type: FETCH_MEMBER_SKILLS,
    graphql: {
      query: `query ($id: ID, $limit: Int) {
        person (id: $id) {
          id
          skills (first: $limit) {
            items {
              id
              name
            }
          }
        }
      }`,
      variables: { id, limit }
    },
    meta: {
      extractModel: 'Person'
    }
  }
}

export const getMemberSkills = createSelector(
  orm,
  state => state.orm,
  (_, props) => props.memberId,
  (session, memberId) => {
    if (session.Person.hasId(memberId)) {
      const person = session.Person.withId(memberId)
      return person.skills.toRefArray()
    }
    return null
  }
)
