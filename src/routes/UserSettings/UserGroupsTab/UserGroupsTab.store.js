import gql from 'graphql-tag'
import {
  CREATE_AFFILIATION,
  DELETE_AFFILIATION,
  LEAVE_GROUP
} from 'store/constants'

export default function reducer (state = {}, action) {
  const { type } = action
  switch (type) {
    case CREATE_AFFILIATION:
    case DELETE_AFFILIATION:
    case LEAVE_GROUP:
      return { ...state, action: type }
    default:
      return state
  }
}

export function createAffiliation ({ role, preposition, orgName, url }) {
  return {
    type: CREATE_AFFILIATION,
    graphql: {
      query: gql`
        mutation CreateAffiliation($role: String, $preposition: String, $orgName: String, $url: String) {
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
        }
      `,
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
      query: gql`
        mutation DeleteAffiliation($id: ID) {
          deleteAffiliation(id: $id)
        }
      `,
      variables: { id }
    },
    meta: {
      id,
      optimistic: true
    }
  }
}

export function leaveGroup (id) {
  return {
    type: LEAVE_GROUP,
    graphql: {
      query: gql`
        mutation LeaveGroup($id: ID) {
          leaveGroup(id: $id)
        }
      `,
      variables: { id }
    },
    meta: {
      id,
      optimistic: true
    }
  }
}
