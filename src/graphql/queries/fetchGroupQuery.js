import groupFieldsFragment from '../fragments/groupFieldsFragment'

export default (withJoinQuestions = false) => `query ($id: ID, $slug: String) {
  group(id: $id, slug: $slug) {
    ${groupFieldsFragment({ withTopics: true, withJoinQuestions })}
  }
}`
