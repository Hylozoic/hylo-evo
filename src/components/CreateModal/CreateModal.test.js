// import React from 'react'
// import CreateModal from './CreateModal'
// import { history } from 'router/index'
// import orm from 'store/models'
// import { graphql } from 'msw'
// import { setupServer } from 'msw/node'
// import { generateStore, render, AllTheProviders } from 'util/reactTestingLibraryExtended'

// export const handlers = [
//   graphql.operation((req, res, ctx) => {
//     return res(ctx.data({
//       topics: {
//         hasMore: false,
//         total: 0,
//         items: []
//       }
//     })
//     )
//   })
// ]

// let providersWithStore
// let graphqlMockServer = setupServer(...handlers)

// beforeAll(() => {
//   graphqlMockServer.listen()
// })

// beforeEach(() => {
//   const session = orm.mutableSession(orm.getEmptyState())
//   session.Me.create({ id: '1' })
//   const initialState = { orm: session.state }
//   const store = generateStore(history, initialState)
//   providersWithStore = AllTheProviders(store)
// })

// it('does something', async () => {
//   const { getByPlaceholderText } = render(<CreateModal match={{}} location={{ search: '' }} />, null, providersWithStore)
//   expect(await getByPlaceholderText('Type group name...')).not.toBe(null)
// })

// afterEach(() => {
//   graphqlMockServer.resetHandlers()
//   providersWithStore = null
// })

it.skip('needs tests that rely upon React Testing Library', () => {})
