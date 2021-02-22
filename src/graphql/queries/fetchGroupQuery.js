import groupFieldsFragment from '../fragments/groupFieldsFragment'

export default (withQuestions = false) => `query ($id: ID, $slug: String) {
  group(id: $id, slug: $slug) {
    ${groupFieldsFragment({ withTopics: true, withQuestions })}
  }
}`
