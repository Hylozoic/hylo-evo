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
export const ADD_SKILL_TO_GROUP = `${MODULE_NAME}/ADD_SKILL_TO_GROUP`
export const ADD_SKILL_TO_GROUP_PENDING = `${ADD_SKILL_TO_GROUP}_PENDING`
export const REMOVE_SKILL = `${MODULE_NAME}/REMOVE_SKILL`
export const REMOVE_SKILL_PENDING = `${REMOVE_SKILL}_PENDING`
export const REMOVE_SKILL_FROM_GROUP = `${MODULE_NAME}/REMOVE_SKILL_FROM_GROUP`
export const REMOVE_SKILL_FROM_GROUP_PENDING = `${REMOVE_SKILL_FROM_GROUP}_PENDING`

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

export function addSkillToGroup (groupId, skillName) {
  return {
    type: ADD_SKILL_TO_GROUP,
    graphql: {
      query: `mutation ($groupId: ID, $name: String) {
        addSuggestedSkillToGroup(groupId: $groupId, name: $name) {
          id,
          name
        }
      }`,
      variables: {
        groupId,
        name: skillName
      }
    },
    meta: {
      optimistic: true,
      groupId,
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

export function removeSkillFromGroup (groupId, skillId) {
  return {
    type: REMOVE_SKILL_FROM_GROUP,
    graphql: {
      query: `mutation ($groupId: ID, $id: ID) {
        removeSuggestedSkillFromGroup(groupId: $groupId, id: $id) {
          success
        }
      }`,
      variables: {
        groupId,
        id: skillId
      }
    },
    meta: {
      optimistic: true,
      groupId,
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
      query: `query MemberSkills ($id: ID, $limit: Int) {
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
  getSkillSuggestionsFromCache,
  (_, props) => props.personId,
  (_, props) => props.group,
  (session, results, personId, group) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    let alreadySelectedIds
    if (personId) {
      const person = session.Person.withId(personId)
      alreadySelectedIds = map('id', person.skills.toRefArray())
    } else if (group) {
      alreadySelectedIds = map('id', group.suggestedSkills)
    }
    const ids = difference(results.ids, alreadySelectedIds)
    return session.Skill.all()
      .filter(x => includes(x.id, ids))
      .orderBy(x => ids.indexOf(x.id))
      .toRefArray()
  }
)

export const getMemberSkills = ormCreateSelector(
  orm,
  (_, props) => props.personId,
  (session, personId) => {
    if (session.Person.idExists(personId)) {
      const person = session.Person.withId(personId)
      return person.skills.toRefArray()
    }
    return null
  }
)
