import {
  CREATE_AFFILIATION,
  DELETE_AFFILIATION,
  LEAVE_COMMUNITY
} from 'store/constants'

export default function reducer (state = {}, action) {
  const { type } = action
  switch (type) {
    case CREATE_AFFILIATION:
    case DELETE_AFFILIATION:
    case LEAVE_COMMUNITY:
      return { ...state, action: type }
    default:
      return state
  }
}

export function createAffiliation ({ role, preposition, orgName, url }) {
  return {
    type: CREATE_AFFILIATION,
    graphql: {
      query: `mutation ($role: String, $preposition: String, $orgName: String, $url: String) {
        createAffiliation(data: { role: $role, preposition: $preposition, orgName: $orgName, url: $url }) {
          id
          role
          preposition
          orgName
          url
          createdAt
          updatedAt
          isActive
        }
      }`,
      variables: { role, preposition, orgName, url }
    },
    meta: {
      role, preposition, orgName, url, optimistic: true
    }
  }
}

export function deleteAffiliation (id) {
  return {
    type: DELETE_AFFILIATION,
    graphql: {
      query: `mutation ($id: ID) {
        deleteAffiliation(id: $id)
      }`,
      variables: { id }
    },
    meta: {
      id,
      optimistic: true
    }
  }
}

export function leaveCommunity (id) {
  return {
    type: LEAVE_COMMUNITY,
    graphql: {
      query: `mutation ($id: ID) {
        leaveCommunity(id: $id)
      }`,
      variables: { id }
    },
    meta: {
      id,
      optimistic: true
    }
  }
}
