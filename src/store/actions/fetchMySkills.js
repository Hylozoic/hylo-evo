import gql from 'graphql-tag'

export const FETCH_MY_SKILLS = `FETCH_MY_SKILLS`

export default function fetchMySkills (type, limit = 20) {
  return {
    type: FETCH_MY_SKILLS,
    graphql: {
      query: gql`
        query MySkillsQuery($limit: Int) {
          me {
            id
            skills (first: $limit) {
              items {
                id
                name
              }
            }
          }
        }
      `,
      variables: { limit }
    },
    meta: {
      extractModel: 'Me'
    }
  }
}
