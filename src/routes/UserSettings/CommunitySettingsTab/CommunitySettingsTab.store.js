import { get } from 'lodash/fp'
import {
  CREATE_AFFILIATION,
  DELETE_AFFILIATION,
  FETCH_FOR_CURRENT_USER,
  LEAVE_COMMUNITY
} from 'store/constants'

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

export default function fetchAffiliationsAndMemberships () {
  return {
    type: FETCH_FOR_CURRENT_USER,
    graphql: {
      query: `query {
        me {
          id
          affiliations {
            items {
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
          memberships {
            id
            hasModeratorRole
            community {
              id
              name
              slug
              avatarUrl
            }
          }
        }
      }`
    },
    meta: {
      extractModel: [
        {
          getRoot: get('me'),
          modelName: 'Me',
          append: true
        }
      ]
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
