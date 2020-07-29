import { createCommunity } from './Review.store'

describe('createCommunity', () => {
  describe('without networkId', () => {
    it('omits networkId from variables', () => {
      const action = createCommunity('thename', 'theslug')
      expect(action).toMatchSnapshot()
      expect(action.graphql.variables.data.networkId).toEqual(undefined)
    })
  })

  describe('with template, topics and networkId', () => {
    it('includes networkId in variables', () => {
      const networkId = 123
      const templateId = 1
      const topics = ['topic']
      const action = createCommunity('thename', 'theslug', templateId, topics, networkId)
      expect(action).toMatchSnapshot()
      expect(action.graphql.variables.data.networkId).toEqual(networkId)
      expect(action.graphql.variables.data.communityTemplateId).toEqual(templateId)
      expect(action.graphql.variables.data.defaultTopics).toEqual(topics)
    })
  })
})
