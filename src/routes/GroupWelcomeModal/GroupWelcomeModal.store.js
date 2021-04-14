export const MODULE_NAME = 'GroupWelcomeModal'
export const FETCH_GROUP_WELCOME_DATA = `${MODULE_NAME}/FETCH_GROUP_WELCOME_DATA`

export const groupWelcomeQuery = `
query ($id: ID) {
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
}`

export function fetchGroupWelcomeData (id) {
  return {
    type: FETCH_GROUP_WELCOME_DATA,
    graphql: {
      query: groupWelcomeQuery,
      variables: { id }
    },
    meta: {
      extractModel: 'Group',
      id
    }
  }
}
