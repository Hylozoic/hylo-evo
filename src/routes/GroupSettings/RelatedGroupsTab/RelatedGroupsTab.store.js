import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import orm from 'store/models'
import { getCurrentlyRelatedGroupIds } from 'store/selectors/getGroupRelationships'
import getMyMemberships from 'store/selectors/getMyMemberships'

export const MODULE_NAME = 'RelatedGroups'

// Constants
export const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`
export const FETCH_GROUP_TO_GROUP_JOIN_QUESTIONS = `${MODULE_NAME}/FETCH_GROUP_TO_GROUP_JOIN_QUESTIONS`

export function fetchGroupToGroupJoinQuestions () {
  return {
    type: FETCH_GROUP_TO_GROUP_JOIN_QUESTIONS,
    graphql: {
      query: `query {
        me {
          memberships {
            id
            group {
              id
              groupToGroupJoinQuestions {
                items {
                  id
                  questionId
                  text
                }
              }
            }
          }
        }
      }`
    },
    meta: {
      extractModel: 'Me'
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

export function setSearch (search) {
  return {
    type: SET_SEARCH,
    payload: search
  }
}

// Selectors
export const moduleSelector = (state) => state[MODULE_NAME]

export const getSearch = createSelector(
  moduleSelector,
  (state, props) => state.search
)

export const getPossibleRelatedGroups = ormCreateSelector(
  orm,
  (_, { group }) => group,
  (state, { group }) => getCurrentlyRelatedGroupIds(state, { groupSlug: group.slug }),
  getMyMemberships,
  (state, group, currentRelationships, myMemberships) => {
    // TODO: check for cycles, cant add a grandparent as a child

    // XXX: can't call getResponsibilitiesForGroup here because it does weird things when passed in the stats straight from ORM 🤷‍♂️
    const commonRoles = state.CommonRole.all().toModelArray()
    const me = state.Me.first()
    const allMembershipCommonRoles = (me.membershipCommonRoles?.items || me.membershipCommonRoles || [])

    return myMemberships.filter(m => {
      if (m.group.id !== group.id && !currentRelationships.includes(m.group.id)) {
        const membershipCommonRoles = allMembershipCommonRoles.filter(mcr => mcr.groupId === m.group.id)
        const commonResp = commonRoles.filter(cr => membershipCommonRoles.find(mcr => mcr.commonRoleId === cr.id)).map(cr => cr.responsibilities.items || cr.responsibilities).flat()
        const groupRolesForGroup = me.groupRoles?.items.filter(groupRole => groupRole.groupId === m.group.id) || []
        const responsibilities = commonResp.concat(groupRolesForGroup.map(groupRole => groupRole.responsibilities.items || []).flat())

        m.hasAdministrationAbility = responsibilities.find(r => r.title === 'Administration') || false
        return true
      }
      return false
    }).sort((a, b) => a.group.name.localeCompare(b.group.name))
  }
)
