// import { combineReducers } from 'redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { get, includes, isEmpty } from 'lodash/fp'
import { difference, map } from 'lodash'

export const MODULE_NAME = 'SkillsSection'

// Constants
export const ADD_SKILL = `${MODULE_NAME}/ADD_SKILL`
export const ADD_SKILL_PENDING = `${ADD_SKILL}_PENDING`

export const REMOVE_SKILL = `${MODULE_NAME}/REMOVE_SKILL`
export const REMOVE_SKILL_PENDING = `${REMOVE_SKILL}_PENDING`

export const FETCH_MEMBER_SKILLS = `${MODULE_NAME}/FETCH_MEMBER_SKILLS`
export const FETCH_SKILLS_AUTOCOMPLETE = `${MODULE_NAME}/FETCH_SKILLS_AUTOCOMPLETE`
export const SET_AUTOCOMPLETE = `${MODULE_NAME}/SET_AUTOCOMPLETE`

// Action Creators

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

export function fetchSkills (autocomplete) {
  return {
    type: FETCH_SKILLS_AUTOCOMPLETE,
    graphql: {
      query: `query ($autocomplete: String) {
        skills (first: 10, autocomplete: $autocomplete) {
          items {
            id
            name
          }
        }
      }`,
      variables: {
        autocomplete
      }
    },
    meta: {
      extractModel: 'Skill',
      extractQueryResults: {
        getItems: get('payload.data.skills')
      }
    }
  }
}

// Reducer
const defaultState = {
  skills: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_AUTOCOMPLETE:
      return {
        ...state,
        autocomplete: payload
      }
    default:
      return state
  }
}

// Selectors

const getSkillsResults = makeGetQueryResults(FETCH_SKILLS_AUTOCOMPLETE)

export const getSkills = ormCreateSelector(
  orm,
  state => state.orm,
  getSkillsResults,
  (_, props) => props.memberId,
  (session, results, memberId) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []

    const person = session.Person.withId(memberId)
    const alreadySelectedIds = map(person.skills.toRefArray(), 'id')
    const ids = difference(results.ids, alreadySelectedIds)

    return session.Skill.all()
      .filter(x => includes(x.id, ids))
      .orderBy(x => ids.indexOf(x.id))
      .toRefArray()
  }
)

export const getMemberSkills = ormCreateSelector(
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

export function setAutocomplete (autocomplete) {
  return {
    type: SET_AUTOCOMPLETE,
    payload: autocomplete
  }
}

export function getAutocomplete (state) {
  return get(`[${MODULE_NAME}].autocomplete`, state)
}
