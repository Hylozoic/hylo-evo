import { setupServer } from 'msw/node'

export const mockGraphqlServer = setupServer()

export default mockGraphqlServer

// AuthLayoutRouter empty handlers for reference; to reduce boilerplace
// possibly pre-polulate these on each test load
//
// graphql.query('MeQuery', (req, res, ctx) => {
//   return res(
//     ctx.data({
//       me: null
//     })
//   )
// }),
// graphql.query('FetchForGroup', (req, res, ctx) => {
//   return res(
//     ctx.data({
//       group: null
//     })
//   )
// }),
// graphql.query('GroupDetailsQuery', (req, res, ctx) => {
//   return res(
//     ctx.data({
//       group: null
//     })
//   )
// }),
// graphql.query('MessageThreadsQuery', (req, res, ctx) => {
//   return res(
//     ctx.data({
//       me: null
//     })
//   )
// }),
// graphql.query('MyPendingJoinRequestsQuery', (req, res, ctx) => {
//   return res(
//     ctx.data({
//       joinRequests: null
//     })
//   )
// }),
// graphql.query('NotificationsQuery', (req, res, ctx) => {
//   return res(
//     ctx.data({
//       notifications: nulle
//     })
//   )
// })
