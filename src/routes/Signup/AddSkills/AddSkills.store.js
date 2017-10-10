export const MODULE_NAME = `AddSkills`
export const SIGNUP_ADD_SKILL = `${MODULE_NAME}/SIGNUP_ADD_SKILL`
export const SIGNUP_REMOVE_SKILL = `${MODULE_NAME}/SIGNUP_REMOVE_SKILL`
export const SIGNUP_REMOVE_SKILL_PENDING = `${SIGNUP_REMOVE_SKILL}_PENDING`

export function addSkill (skillName) {
  return {
    type: SIGNUP_ADD_SKILL,
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
    type: SIGNUP_REMOVE_SKILL,
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
