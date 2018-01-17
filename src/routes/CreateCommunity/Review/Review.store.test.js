import { createCommunity } from './Review.store'

describe('createCommunity', () => {
  describe('without networkId', () => {
    it('omits networkId from variables', () => {
      const action = createCommunity('thename', 'theslug')
      expect(action).toMatchSnapshot()
      expect(action.graphql.variables.data.networkId).toEqual(undefined)
    })
  })

  describe('with networkId', () => {
    it('includes networkId in variables', () => {
      const networkId = 123
      const action = createCommunity('thename', 'theslug', networkId)
      expect(action).toMatchSnapshot()
      expect(action.graphql.variables.data.networkId).toEqual(networkId)
    })
  })
})
