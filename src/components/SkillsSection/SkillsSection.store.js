import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get, includes, isEmpty, difference, map } from 'lodash/fp'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const MODULE_NAME = 'SkillsSection'
export const FETCH_MEMBER_SKILLS = `${MODULE_NAME}/FETCH_MEMBER_SKILLS`
export const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`
export const FETCH_SKILL_SUGGESTIONS = `${MODULE_NAME}/FETCH_SKILL_SUGGESTIONS`
export const ADD_SKILL = `${MODULE_NAME}/ADD_SKILL`
export const ADD_SKILL_PENDING = `${ADD_SKILL}_PENDING`
export const REMOVE_SKILL = `${MODULE_NAME}/REMOVE_SKILL`
export const REMOVE_SKILL_PENDING = `${REMOVE_SKILL}_PENDING`

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

export function setSearch (search) {
  return {
    type: SET_SEARCH,
    payload: search
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

export function fetchSkillSuggestions (search) {
  return {
    type: FETCH_SKILL_SUGGESTIONS,
    graphql: {
      query: `query ($search: String) {
        skills (first: 10, autocomplete: $search) {
          items {
            id
            name
          }
        }
      }`,
      variables: {
        search
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
  search: ''
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_SEARCH:
      return {
        ...state,
        search: payload
      }
    default:
      return state
  }
}

// Selectors

export const getSearch = state => get(`[${MODULE_NAME}].search`, state)

const getSkillSuggestionsFromCache = makeGetQueryResults(FETCH_SKILL_SUGGESTIONS)

export const getSkillSuggestions = ormCreateSelector(
  orm,
  state => state.orm,
  getSkillSuggestionsFromCache,
  (_, props) => props.personId,
  (session, results, personId) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    const person = session.Person.withId(personId)
    const alreadySelectedIds = map('id', person.skills.toRefArray())
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
  (_, props) => props.personId,
  (session, personId) => {
    if (session.Person.hasId(personId)) {
      const person = session.Person.withId(personId)
      return person.skills.toRefArray()
    }
    return null
  }
)
