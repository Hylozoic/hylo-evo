import gql from 'graphql-tag'

export const MODULE_NAME = 'GroupWelcomeModal'
export const FETCH_GROUP_WELCOME_DATA = `${MODULE_NAME}/FETCH_GROUP_WELCOME_DATA`

export const GroupWelcomeQuery = gql`
  query GroupWelcome($id: ID) {
    group (id: $id) {
      id
      joinQuestions {
        items {
          id
          questionId
          text
        }
      }
      suggestedSkills {
        items {
          id
          name
        }
      }
    }
  }
`

export function fetchGroupWelcomeData (id) {
  return {
    type: FETCH_GROUP_WELCOME_DATA,
    graphql: {
      query: GroupWelcomeQuery,
      variables: { id }
    },
    meta: {
      extractModel: 'Group',
      id
    }
  }
}
