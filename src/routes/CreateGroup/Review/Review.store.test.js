import { createGroup } from './Review.store'

describe('createGroup', () => {
  describe('without networkId', () => {
    it('omits networkId from variables', () => {
      const action = createGroup('thename', 'theslug')
      expect(action).toMatchSnapshot()
      expect(action.graphql.variables.data.networkId).toEqual(undefined)
    })
  })

  // TODO: fix up with parents
  // describe('with parentIds', () => {
  //   it('includes networkId in variables', () => {
  //     const networkId = 123
  //     const action = createGroup('thename', 'theslug', networkId)
  //     expect(action).toMatchSnapshot()
  //     expect(action.graphql.variables.data.networkId).toEqual(networkId)
  //   })
  // })
})
