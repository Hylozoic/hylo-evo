import { setupServer } from 'msw/node'
import { defaultHandlers } from './handlers'

export const mockGraphqlServer = setupServer(defaultHandlers)

export default mockGraphqlServer
